import { MasterDatabase } from "../../../ker/core/databases/master";
import { Randomizer } from "../../../ker/utils/randomizer";
import { ApiTimer } from "../../../ker/utils/timer";
import { AppsModel } from "../../models/apps/model";
import { IApps, IAppsCache } from "../../models/apps/types";

export const setNewApp = async (app: IApps) => {
    let appsObject: IAppsCache = {
        ...app,
        metadata: {
            ...app.metadata,
            isDeleted: false,
            creationDate: new ApiTimer().getDateObject(),
            updatedDate: undefined,
            deletionDate: undefined,
            appID: Randomizer.UUIDGenerator(),
            isActive: app.metadata?.isActive || true,
        },
    };
    await MasterDatabase.createDocument(AppsModel, appsObject);

    return appsObject
}