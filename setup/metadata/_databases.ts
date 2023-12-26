import { IMongoDatabase } from "../../src/ker/models/databases/mongo/types";

export const _databases: IMongoDatabase[] = [
    {
        // unique name of the database (required)
        coreDBName: 'mongoCore01',
        metadata: {
            // flags the database as master (required, only one must be flagged as 'master')
            dbRole: 'master',
            // default connection collection (required)
            defaultDB: 'apis',
        },
        host: {
            // database host (required)
            host: '100.0.0.12',
            // database port (required)
            port: 27117,
        },
        auth: {
            // database auth user (required)
            username: 'root',
            // database auth password (optional)
            password: 'underground',
        },
        connectionOptions: {
            // connection timeout (optional)
            connectTimeoutMS: 50000000,
            heartbeatFrequencyMS: 10000000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    {
        coreDBName: 'apiKer',
        metadata: {
            defaultDB: 'apikers',
        },
        host: {
            host: '100.0.0.12',
            port: 27118,
        },
        auth: {
            username: 'root',
            password: 'underground',
        },
        connectionOptions: {
            connectTimeoutMS: 50000000,
            heartbeatFrequencyMS: 10000000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    {
        coreDBName: 'Log',
        metadata: {
            defaultDB: 'traceLogs',
        },
        host: {
            host: '100.0.0.12',
            port: 27119,
        },
        auth: {
            username: 'root',
            password: 'underground',
        },
        connectionOptions: {
            connectTimeoutMS: 50000000,
            heartbeatFrequencyMS: 10000000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    }
]