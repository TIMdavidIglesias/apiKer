// CORE
// - types
import { ISetupCache } from "../../models/setup/types";
import { IVarsCache } from "../../models/vars/types";
import { IEnvCache } from "../../models/env/types";
import { IMongoDatabaseCache } from "../../models/databases/mongo/types";
import { IAppsCache } from "../../../api/models/apps/types";
import { IRouterCache } from "../../../api/models/router/types";
import { gSixDocs } from "../../../modules/gSix/doc";

// defines a memory cache ready to store the core and API data. Ready to use in execution time
export class Cache {
    // Stores environment-related data
    public static _env: IEnvCache;

    // Stores setup-related data
    public static _setup: ISetupCache;

    // Stores information about MongoDB databases
    public static _databases: IMongoDatabaseCache[];

    // Stores information about applications
    public static _apps: IAppsCache[];

    // Stores information about API routes
    public static _router: IRouterCache[];

    // Stores variables (possibly for general use)
    public static _vars: IVarsCache;

    // SWAGGER
    public static _gSixDocumentation: gSixDocs | undefined;
}

