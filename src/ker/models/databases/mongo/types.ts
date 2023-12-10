export interface IMongoDatabase {
    coreDBName: string,
    metadata?: IMongoDatabaseMetadata,
    host: IMongoDatabaseHost,
    auth: IMongoDatabaseAuth,
    connectionOptions?: IMongoDatabaseConnectionOptions
}

export interface IMongoDatabaseAuth {
    username: string
    password?: string
}

export interface IMongoDatabaseHost {
    host: string,
    port: number,
}

export interface IMongoDatabaseMetadata {
    dbRole?: string,
    defaultDB: string,
    dbID?: string,
    creationDate?: Date,
    updatedDate?: Date | undefined,
    isActive?: boolean
}

export interface IMongoDatabaseConnectionOptions {
    connectTimeoutMS?: number,
    heartbeatFrequencyMS?: number,
    useNewUrlParser?: boolean,
    useUnifiedTopology?: boolean,
}
