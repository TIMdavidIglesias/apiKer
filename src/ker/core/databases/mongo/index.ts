// modules
import mongoose, { Connection, Model, Schema } from "mongoose";

// ERROR
import { ApiError } from "../../error";
import { IApiError } from "../../../models/error/types";

// CORE
import {
    IMongoDatabaseCache,
    IMongoDatabaseConnectionOptions
} from "../../../models/databases/mongo/types";

export class MongoDatabase {
    public static isMasterAlreadydefined: boolean = false
    public connectionString: string;
    private connectionOptions: IMongoDatabaseConnectionOptions | undefined;
    private connection: Connection | undefined;
    private database: IMongoDatabaseCache;
    private customDB: string;
    private isMaster: boolean = false;

    /**
     * Constructor for the MongoDatabase class.
     *
     * @param database The database configuration for MongoDB.
     * @param customDB Optional custom database name (default is undefined).
     */
    constructor(database: IMongoDatabaseCache, customDB: string | undefined = undefined) {
        // database in use
        this.database = database;
        // connections options to connect the database instance
        this.connectionOptions = database.connectionOptions;
        // connection string for mongo connection
        this.connectionString = MongoDatabase.getConnectionString(database, customDB || database.metadata.defaultDB);

        // flags the instance as master connection. Wil use mongoose features
        // this.isMaster = (!MongoDatabase.isMasterAlreadydefined && database.dbRole === 'master') || false;

        // flaggin masterDatabase as active. Will prevent future connections to emulate a master database connection.
        if (!MongoDatabase.isMasterAlreadydefined) {
            // metadata reading for database role
            if (database.metadata.dbRole === 'master') {
                this.isMaster = true
                // will prevent multiple master connections. Master connection must be unique.
                MongoDatabase.isMasterAlreadydefined = true
            }
        }

        //mongo collection for connection instance
        this.customDB = customDB || database.metadata.defaultDB;
    }

    /**
     * Gets a MongoDB connection string for the specified database.
     *
     * @param database The database configuration for MongoDB.
     * @param collectionName Optional collection name (default is undefined).
     * @param includeCollectionName Optional flag to include the collection name in the connection string (default is true).
     * @returns The MongoDB connection string.
     */
    public static getConnectionString(database: IMongoDatabaseCache, collectionName: string | undefined = undefined, includeCollectionName: boolean = true): string {
        return `mongodb://${database.auth.username}:${database.auth.password}@${database.host.host}:${database.host.port}/${includeCollectionName ? collectionName || database.metadata.defaultDB : ''}`;
    }

    /**
     * Establishes a connection to the MongoDB database.
     *
     * @param connectionOptions Optional connection options (default is undefined).
     * @throws Throws an ApiError if there's an issue connecting to the database.
     */
    public async connect(connectionOptions: IMongoDatabaseConnectionOptions | undefined = undefined): Promise<void> {
        try {
            if (this.isMaster) {
                await mongoose.connect(this.connectionString, connectionOptions || this.database.connectionOptions);
            } else {
                const mongooseSlave = require('mongoose')
                this.connection = await new Promise(async (resolve, reject) => {
                    try {
                      const connection = await mongooseSlave.createConnection(this.connectionString, connectionOptions || this.database.connectionOptions);
                      console.log('Conexión exitosa a la base de datos');
                      resolve(connection);
                    } catch (error) {
                      console.error('Error al conectar a la base de datos:', error);
                      reject(error);
                    }
                  });
                
            }
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_CONNECTING',
                exception: exception,
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString}`
            };
            throw new ApiError(errorDetails);
        }
    }

    /**
     * Deletes a model from the MongoDB database.
     *
     * @param modelName The name of the model to delete.
     */
    public deleteModel(modelName: string) {
        this.connection?.deleteModel(modelName);
    }

    /**
     * Closes the MongoDB database connection.
     *
     * @throws Throws an ApiError if there's an issue closing the connection.
     */
    public async close(): Promise<void> {
        await this.connection?.close();
    }

    /**
     * Creates a Mongoose model from a schema for the specified collection.
     *
     * @param schema The Mongoose schema to use.
     * @param collectionName The name of the collection.
     * @returns The created Mongoose model.
     * @throws Throws an ApiError if there's an issue creating the model.
     */
    public async createModelFromSchema(schema: Schema, collectionName: string): Promise<typeof Model> {
        try {
            if (this.isMaster) {
                return await mongoose.model(collectionName, schema);
            }

            return await this.connection?.model(collectionName, schema) as typeof Model;
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_CREATING_MODEL',
                exception: exception,
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString} /`
            };
            throw new ApiError(errorDetails);
        }
    }

    /**
     * Creates a document in the MongoDB database using the specified model and data.
     *
     * @param model The Mongoose model to use.
     * @param data The data to insert (default is an empty object).
     * @returns The created document.
     * @throws Throws an ApiError if there's an issue creating the document.
     */
    public async createDocument(model: typeof Model, data: any = {}): Promise<any> {
        try {
            if (Array.isArray(data)) {
                return await model.collection.insertMany(data).catch((exception) => { throw exception });
            } else {
                try {
                    return await model.create(data);
                } catch (exception) {
                    // Tratar la excepción según sea necesario
                    console.error('Error en insertMany:', exception);
                    throw exception; // Lanzar la excepción nuevamente para que sea capturada en el catch general
                }
            }
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_CREATE_DOCUMENT_ERROR',
                exception: exception,
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString}`
            };
            throw new ApiError(errorDetails);
        }
    }

    /**
     * Finds documents in the MongoDB database using the specified model, limit, criteria, and raw flag.
     *
     * @param model The Mongoose model to use.
     * @param limit The maximum number of documents to retrieve (default is 0).
     * @param criteria The search criteria (default is an empty object).
     * @param raw Whether to return raw documents (default is true).
     * @returns The found documents.
     * @throws Throws an ApiError if there's an issue finding documents.
     */
    public async findDocument(model: typeof Model, limit: number = 0, criteria: any = {}, raw: boolean = true): Promise<any> {
        try {
            let res;
            res = await model.find(criteria).limit(limit);
            if (Object.keys(res).length === 0) return
            if (limit === 1 && Array.isArray(res)) return raw ? res[0] : res[0].toObject()
            // return res.map((r)=>{return{...r.toObject(),id:r.toObject()['_id'].id.toString('hex')}});
            return res.map((r) => { return raw ? r : r.toObject() });
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_DATABASE_FIND_ERROR',
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString}`,
                exception: exception,
            };
            throw new ApiError(errorDetails);
        }
    }

    /**
     * Updates documents in the MongoDB database using the specified model, limit, criteria, and data.
     *
     * @param model The Mongoose model to use.
     * @param limit The maximum number of documents to update (default is 1).
     * @param criteria The update criteria.
     * @param dataUpdated The data to update the documents.
     * @returns The result of the update operation.
     * @throws Throws an ApiError if there's an issue updating documents.
     */
    public async updateDocument(model: typeof Model, limit: number = 1, criteria: any = {}, dataUpdated: any = {}): Promise<any> {
        try {
            let res;
            res = await model.updateMany(criteria, dataUpdated).limit(limit);
            if (limit === 1 && Array.isArray(res)) return res[0];
            return res;
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_DATABASE_UPDATE_ERROR',
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString}`,
                exception: exception,
            };
            throw new ApiError(errorDetails);
        }
    }

    public async deleteDocument(model: typeof Model, criteria: any = {}): Promise<any> {
        try {
            let res;
            res = await model.deleteMany(criteria);
            return res;
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_DATABASE_DELETE_ERROR',
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString}`,
                exception: exception,
            };
            throw new ApiError(errorDetails);
        }
    }

    /**
     * Counts documents in the MongoDB database from the specified collection using the given criteria.
     *
     * @param collection The name of the collection to count documents from.
     * @param criteria The criteria for counting (default is an empty object).
     * @returns The count of documents.
     * @throws Throws an ApiError if there's an issue counting documents.
     */
    public async countDocumentFromCollection(collection: string, criteria: any = {}): Promise<number> {
        try {
            return await this.connection?.collection(collection + 's').countDocuments(criteria) || 0;
        } catch (exception) {
            const errorDetails: IApiError = {
                name: 'ERR_MONGODB_DATABASE_COUNT_ERROR',
                exception: exception,
                additionalInfo: `${this.isMaster ? '[MASTER]' : '[SLAVE]'} SconnString: ${this.connectionString}`
            };
            throw new ApiError(errorDetails);
        }
    }
}
