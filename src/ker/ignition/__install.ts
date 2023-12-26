
// DATABASES


// LOG


// CORE
import { Log } from "../core/log";
import { MasterDatabase } from "../core/databases/master";
import { ISetupCache } from "../models/setup/types";
// - models
import { VarsModel } from "../models/vars/model";
import { IMongoDatabase } from "../models/databases/mongo/types";
import { SetupModel } from "../models/setup/model";

// UTILS
import { ApiTimer } from "../utils/timer";

// METADATA
import { _databases } from "../../../setup/metadata/_databases";
import { _vars } from "../../../setup/metadata/_vars";
import { _router } from "../../../setup/metadata/_router";
import { _apps } from "../../../setup/metadata/_apps";
import { _setup } from "../../../setup/metadata/_setup";

// API
// - models
import { IRouterCache } from "../../api/models/router/types";
import { IAppsCache } from "../../api/models/apps/types";
import { setNewRoute } from "../../api/core/router/manager";
import { setNewDtabase } from "../core/databases/manager";
import { setNewApp } from "../../api/core/apps/manager";

const LOG_MESSAGES = {
  SETUP_METADATA_RECORDING: "[SETUP] Recording _setup metadata integrity ...",
  SETUP_METADATA_PASSED: "[SETUP] [PASSED] _setup data recorded OK ...",
  DATABASES_METADATA_CHECKING: "[DATABASES] Checking _databases metadata integrity...",
  DATABASES_METADATA_PASSED: "[DATABASES] [PASSED] _databases data recorded OK",
  VARS_METADATA_CHECKING: "[VARS] Checking _vars setup data integrity ...",
  VARS_METADATA_PASSED: "[VARS] [PASSED] _vars data recorded OK ...",
  ROUTER_METADATA_CHECKING: "[ROUTER] Checking _router setup data integrity ...",
  ROUTER_METADATA_PASSED: "[ROUTER] [PASSED] _router data recorded OK ...",
  APPS_METADATA_CHECKING: "[APPS] Checking _apps setup data integrity ...",
  APPS_METADATA_PASSED: "[APPS] [PASSED] _apps data recorded OK ...",
  SETUP_FAILED: "[SETUP] [FAIL] Setup has failed ...", // Future implementation
};

/**
 * Installs API metadata into the master database.
 * 
 * This function records setup metadata, database metadata, vars metadata, router metadata,
 * ignoring routes metadata, and app metadata into the database.
 */
export const installApiMetadata = async () => {
  const now = new ApiTimer().getDateObject()

  try {
    // setting up
    Log.logAddEntry(LOG_MESSAGES.SETUP_METADATA_RECORDING, 1);
    const setupMetadataObject: ISetupCache = {
      ..._setup,
      setupTime: now,
    };

    // retrieves the cached setup metadata from the database
    await MasterDatabase.createDocument(SetupModel, setupMetadataObject);
    Log.logAddEntry(LOG_MESSAGES.SETUP_METADATA_PASSED, 2);

    Log.logAddEntry(LOG_MESSAGES.DATABASES_METADATA_CHECKING, 1);
    // creates the database metadata ready to get ingested
    let setupDatabaseObject: IMongoDatabase[] = [];
    for (const mongoDatabase of _databases) {
      const newDatabase = await setNewDtabase(mongoDatabase)
      setupDatabaseObject.push(newDatabase);
    }
    Log.logAddEntry(LOG_MESSAGES.DATABASES_METADATA_PASSED, 2);

    Log.logAddEntry(LOG_MESSAGES.VARS_METADATA_CHECKING, 1);
    await MasterDatabase.createDocument(VarsModel, _vars);
    Log.logAddEntry(LOG_MESSAGES.VARS_METADATA_PASSED, 2);

    Log.logAddEntry(LOG_MESSAGES.ROUTER_METADATA_CHECKING, 1);
    let setupRouterObject: IRouterCache[] = [];
    for (const route of _router) {
      const newRoute = await setNewRoute(route)
      setupRouterObject.push(newRoute);
    }
    Log.logAddEntry(LOG_MESSAGES.ROUTER_METADATA_PASSED, 2);

    // the app metadata gets ready to get ingested
    Log.logAddEntry(LOG_MESSAGES.APPS_METADATA_CHECKING, 1);
    let setupAppsObject: IAppsCache[] = [];
    for (const app of _apps) {
      const newApp = await setNewApp(app)
      setupAppsObject.push(newApp)
    }

    Log.logAddEntry(LOG_MESSAGES.APPS_METADATA_PASSED, 2);
  } catch (exception) {
    Log.logAddEntry(LOG_MESSAGES.SETUP_FAILED, 3);
    throw exception;
  }
};
