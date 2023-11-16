// CORE
import { Cache } from "../cache"
// - types
import { IMongoDatabaseCache } from "../../models/databases/mongo/types"
import { Db } from "mongodb"

/**
 * Gets the stored database by name.
 *
 * @param dbName The name of the database to retrieve.
 * @returns The database configuration if found, otherwise undefined.
 */
export const getDatabaseByName = (dbName: string): IMongoDatabaseCache | undefined => {
    return Cache._databases.find((db: IMongoDatabaseCache) => db.coreDBName === dbName)
}

/**
 * Gets all database data.
 *
 * @returns An array of all database configurations.
 */
export const getAllDatabases = (): IMongoDatabaseCache[] => {
    return Cache._databases
}

