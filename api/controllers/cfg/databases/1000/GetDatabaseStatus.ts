// import { IFilterArgs } from "../../../../ker/src/models/controller/types"

import { MongoDatabase } from "../../../../../src/ker/core/databases/mongo"

// import { IApiError } from "../../../../../ker/src/models/error/types"

export const GetDatabaseStatus = async (args: any) => {
    // console.log(args.METADATA.req)

    const res: any = {
        error: [],
        success: []
    }

    let i = 0
    for (const dbs of args.CACHE.DATABASES.getAllDatabases()) {
        let db: any = undefined
        db = args.DATABASES.newDBConnection(dbs)
        try {
            await db.connect()
            await db.close();
            db = undefined
            res['success'].push({ ...dbs, auth: { ...dbs.auth, password: '<HIDDEN>' } });
        } catch (ex) {
            await db.connect()
            await db.close();
            db = undefined
            res['error'].push({ ...dbs, auth: { ...dbs.auth, password: '<HIDDEN>' } });
        }
    }

    return args.RESULT.dispatch(res)
}