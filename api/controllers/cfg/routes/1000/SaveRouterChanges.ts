// import { IFilterArgs } from "../../../../ker/src/models/controller/types"


// import { IApiError } from "../../../../../ker/src/models/error/types"

export const SaveRouterChanges = async (args: any) => {
    // console.log(args.METADATA.req)


    return args.RESULT.dispatch(args.CACHE.ROUTER.getAllRoutes())
}