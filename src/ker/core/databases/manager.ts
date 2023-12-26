import { MongoDatabaseModel } from "../../models/databases/mongo/model";
import { IMongoDatabase } from "../../models/databases/mongo/types";
import { Randomizer } from "../../utils/randomizer";
import { ApiTimer } from "../../utils/timer";
import { MasterDatabase } from "./master";

export const setNewDtabase = async (mongoDatabase: IMongoDatabase) => {
    let dbObject: IMongoDatabase = {
        ...mongoDatabase,
        metadata: {
            ...mongoDatabase.metadata,
            defaultDB: mongoDatabase.metadata?.defaultDB||'default', // Asegura que defaultDB tenga un valor de tipo 'string'
            creationDate: new ApiTimer().getDateObject(),
            updatedDate: undefined,
            dbID: Randomizer.UUIDGenerator(),
            isActive: mongoDatabase.metadata?.isActive !== false,
        },
    };

    await MasterDatabase.createDocument(MongoDatabaseModel, dbObject);
    return dbObject
}