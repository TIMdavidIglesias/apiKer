// import { IFilterArgs } from "../../../../ker/src/models/controller/types"

import { RouterModel } from "../../../../../src/api/models/router/model"
import { MongoDatabase } from "../../../../../src/ker/core/databases/mongo"
import { IMongoDatabase } from "../../../../../src/ker/models/databases/mongo/types"


// import { IApiError } from "../../../../../ker/src/models/error/types"

export const UpdateRouterList = async (args: any) => {
    const params = args.REQUEST.getParams()

    // console.log(args.METADATA.req)
    const db = args.DATABASES.newDBConnection() as MongoDatabase
    // no database param, = master

    for (const route of params.body.routers) {
        try {
            await db.updateDocument(RouterModel, 0, { $and: [{ 'metadata.routerID': route.metadata.routerID }] }
                , route)
        } catch (exception) {
            console.log(exception)
        }
    }


    return args.RESULT.dispatch(args.CACHE.ROUTER.getAllRoutes())
}