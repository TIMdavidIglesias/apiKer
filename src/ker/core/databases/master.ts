// MODULES
import { Model } from "mongoose";

// CORE
import { MongoDatabase } from "./mongo";
// - types
import { IMongoDatabaseCache } from "../../models/databases/mongo/types";

export class MasterDatabase {
    // object containing the master database connection object
    public static masterAPIConnection: MongoDatabase

    // master database metadata object
    public static masterDatabase: IMongoDatabaseCache

    /**
     * Connects to the master database.
     *
     * @param masterDB The configuration for the master database.
     */
    public static async connect(masterDB: IMongoDatabaseCache): Promise<void> {
        // Store the master database
        MasterDatabase.masterDatabase = masterDB;

        // Store the master connection
        MasterDatabase.masterAPIConnection = new MongoDatabase(masterDB, undefined);

        // Connect to the masterDB
        await MasterDatabase.masterAPIConnection.connect();
    }

    /**
     * Finds a document in the Master Database.
     *
     * @param model The Mongoose model to use.
     * @param limit The maximum number of documents to retrieve (default is 0).
     * @param criteria The search criteria (default is an empty object).
     * @param raw Whether to return raw documents (default is true).
     */
    public static async findDocument(model: typeof Model, limit: number = 0, criteria: any = {}, raw: boolean = true) {
        try {
            return await MasterDatabase.masterAPIConnection.findDocument(model, limit, criteria, raw);
        } catch (exception) {
            throw exception
        }
    }

    /**
      * Inserts a new document in the Master Database.
      *
      * @param model The Mongoose model to use.
      * @param data The data to insert (default is an empty object).
      */
    public static async createDocument(model: typeof Model, data: any = {}) {
        try {
            await MasterDatabase.masterAPIConnection.createDocument(model, data);
        } catch (exception) {
            throw exception
        }
    }

    public static async updateDocument(model: typeof Model, limit: number = 0, criteria: any = {}, dataUpdated: any = {}) {
        try {
            await MasterDatabase.masterAPIConnection.updateDocument(model, limit, criteria, dataUpdated);
        } catch (exception) {
            throw exception
        }
    }

    public static async deleteDocument(model: typeof Model) {
        try {
            await MasterDatabase.masterAPIConnection.deleteDocument(model);
        } catch (exception) {
            throw exception
        }
    }
}
