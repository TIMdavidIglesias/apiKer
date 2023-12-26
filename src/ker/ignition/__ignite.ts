// CORE
import { Log } from "../core/log";
import { MasterDatabase } from "../core/databases/master";
import { Cache } from "../core/cache";
// - swaggerDocs
import { gSixDocs } from "../../modules/gSix/doc";

// MODELS
import { AppsModel } from "../../api/models/apps/model";
import { RouterModel } from "../../api/models/router/model";
import { MongoDatabaseModel } from "../models/databases/mongo/model";
import { SetupModel } from "../models/setup/model";
import { VarsModel } from "../models/vars/model";

const LOG_MESSAGES = {
  SETUP: "[IGNITION] Setup loaded OK ...",
  DATABASES: "[IGNITION] Databases loaded OK ...",
  APPS: "[IGNITION] Apps loaded OK ...",
  VARS: "[IGNITION] Vars loaded OK ...",
  ROUTER: "[IGNITION] Router loaded OK ...",
  LOADING_DATA_FAILED: '[LOADING CORE DATA] [FAIL] ...'
};

/**
 * Loads API metadata from the master database and stores it in the cache.
 * 
 * This function retrieves setup metadata, database metadata, vars metadata, router metadata,
 * ignoring routes metadata, and app metadata from the database and stores them in the cache.
 */
export const loadApiMetadata = async () => {
  try {
    const _setup = await MasterDatabase.findDocument(SetupModel, 1);
    Log.logAddEntry(LOG_MESSAGES.SETUP, 2);

    const _databases = await MasterDatabase.findDocument(MongoDatabaseModel, 0, {}, false);
    Log.logAddEntry(LOG_MESSAGES.DATABASES, 2);

    const _vars = await MasterDatabase.findDocument(VarsModel, 1);
    Log.logAddEntry(LOG_MESSAGES.VARS, 2);

    const _router = await MasterDatabase.findDocument(RouterModel, 0, {}, false);
    Log.logAddEntry(LOG_MESSAGES.ROUTER, 2);

    const _apps = await MasterDatabase.findDocument(AppsModel);
    Log.logAddEntry(LOG_MESSAGES.APPS, 2);

    Cache._setup = _setup;
    Cache._databases = _databases;
    Cache._vars = _vars;
    Cache._router = _router;
    Cache._apps = _apps;

    // swaggerDocs
    if (_vars.documentation.isActive) {
      Cache._gSixDocumentation = new gSixDocs()
    }

  } catch (exception) {
    Log.logAddEntry(LOG_MESSAGES.LOADING_DATA_FAILED, 3);
    throw exception;
  }
};
