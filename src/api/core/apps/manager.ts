// CORE
import { MasterDatabase } from "../../../ker/core/databases/master";
// - types
import { IApps, IAppsCache } from "../../models/apps/types";
import { AppsModel } from "../../models/apps/model";

// UTILS
import { Randomizer } from "../../../ker/utils/randomizer";
import { ApiTimer } from "../../../ker/utils/timer";

/**
 * Generates a new app in the database based on the provided metadata.
 * 
 * @param app The metadata for the new app.
 * @returns The generated app object with additional information such as secret tokens and creation date.
 */
export const setNewApp = async (app: IApps) => {
    // Generate unique secret tokens and keys for the new app
    const appsObject: IAppsCache = {
        ...app,
        authorization: { secretToken: Randomizer.RandomString(64) },
        applicationSecretToken: Randomizer.RandomString(64),
        applicationSecretTokenRefresh: Randomizer.RandomString(64),
        encryptionKey: Randomizer.RandomString(64),
        metadata: {
            ...app.metadata,
            // Set creation date to the current date
            creationDate: new ApiTimer().getDateObject(),
            // Set updated date to undefined initially
            updatedDate: undefined,
            // Generate a unique app ID using UUID
            appID: Randomizer.UUIDGenerator(),
            // Set isActive based on provided metadata or default to true
            isActive: app.metadata?.isActive || true,
        },
    };

    // Create a new document in the Master Database for the app
    await MasterDatabase.createDocument(AppsModel, appsObject);

    return appsObject;
}
