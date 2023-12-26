// CORE
import { MasterDatabase } from "../../../ker/core/databases/master";
// - types
import { IRouterCache } from "../../models/router/types";
import { RouterModel } from "../../models/router/model";

// UTILS
import { Randomizer } from "../../../ker/utils/randomizer";
import { ApiTimer } from "../../../ker/utils/timer";

/**
 * Creates a new route in the database based on the provided metadata.
 * 
 * @param route The metadata for the new route.
 * @returns The generated route object with additional information such as creation date and unique ID.
 */
export const setNewRoute = async (route: IRouterCache) => {
    // Create a new route object with default values and additional metadata
    const routerObject: IRouterCache = {
        ...route,
        metadata: {
            ...route.metadata,
            // Set isActive based on provided metadata or default to true
            isActive: route.metadata?.isActive !== false,
            // Set creation date to the current date
            creationDate: new ApiTimer().getDateObject(),
            // Set updated date to undefined initially
            updatedDate: undefined,
            // Generate a unique router ID using UUID
            routerID: Randomizer.UUIDGenerator(),
        },
    };

    // Create a new document in the Master Database for the route
    await MasterDatabase.createDocument(RouterModel, routerObject);

    return routerObject;
}

export const updateRoute = async (route: IRouterCache) => {
    // Create a new route object with default values and additional metadata
    const routerObject: IRouterCache = {
        ...route,
        metadata: {
            ...route.metadata,
            // Set isActive based on provided metadata or default to true
            isActive: route.metadata?.isActive !== false,
            // Set creation date to the current date
            creationDate: new ApiTimer().getDateObject(),
            // Set updated date to undefined initially
            updatedDate: undefined,
            // Generate a unique router ID using UUID
            routerID: Randomizer.UUIDGenerator(),
        },
    };

    // Create a new document in the Master Database for the route
    await MasterDatabase.updateDocument(RouterModel,1,{route:route.route} ,routerObject);

    return routerObject;
}
