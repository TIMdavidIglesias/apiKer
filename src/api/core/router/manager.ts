import { RouterModel } from "../../models/router/model";
import { IRouterCache } from "../../models/router/types";
import { Randomizer } from "../../../ker/utils/randomizer";
import { ApiTimer } from "../../../ker/utils/timer";
import { MasterDatabase } from "../../../ker/core/databases/master";

export const setNewRoute = async (route: IRouterCache) => {
    let routerObject: IRouterCache = {
        ...route,
        metadata: {
            ...route.metadata,
            isActive: route.metadata?.isActive !== false,
            creationDate: new ApiTimer().getDateObject(),
            updatedDate: undefined,
            routerID: Randomizer.UUIDGenerator(),
        },
    }

    await MasterDatabase.createDocument(RouterModel, routerObject);

    return routerObject
}