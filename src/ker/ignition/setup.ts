// CORE
import { Log } from "../core/log";
import { Cache } from "../core/cache";
import { MasterDatabase } from "../core/databases/master";

// UTILS
import { ApiCommandConsole } from "../utils/console";
import { ApiTimer } from "../utils/timer";

// ERROR
import { ApiError } from "../core/error";
import { IApiError } from "../models/error/types";

// SETUP
import { SetupModel } from "../models/setup/model";

// IGNITION
import { installApiMetadata } from "./__install";
import { loadApiMetadata } from "./__ignite";

const LOG_MESSAGES = {
  LOOKING_FOR_EXISTING_SETUP: "[IGNITION] Looking for existing setup metadata...",
  NO_SETUP_METADATA_FOUND: "[IGNITION] No setup metadata found ...",
  SETUP_NAME: "Setup name:               ",
  SETUP_VERSION: "Setup version:            ",
  SETUP_DATE: "Setup date:        ",
  IGNITION_FAIL: "Ignition has failed ...",
};

/**
 * Initializes the core of the API server.
 * 
 * This function goes through several initialization steps, connects to the master database,
 * and sets up the API data. It also handles errors and exceptions that may occur during the process.
 */
export const initializeMasterEnvironmentSetup = async () => {
  try {
    Log.logAddEntry(LOG_MESSAGES.LOOKING_FOR_EXISTING_SETUP, 1);
    const setupMetadata = await MasterDatabase.findDocument(SetupModel, 1);

    // No setup metadata found. A new setup is required
    if (!setupMetadata || setupMetadata.length === 0) {
      Log.logAddEntry(LOG_MESSAGES.NO_SETUP_METADATA_FOUND, 2);

      // install the metadata from the setup files
      await installApiMetadata();

      // loads the cache data storage
      await loadApiMetadata();
    } else {
      // at this point, the api has been previously installed and proceeding
      // to load the stored metadata within the Master database
      await loadApiMetadata();
    }

    // checking the setup status
    if (!Cache._setup.setupTime) {
      const errorDetails: IApiError = {
        name: 'ERR_IGNITION_UNEXPECTED_ERROR_LOADING_SETUP',
      };
      throw new ApiError(errorDetails);
    }

    ApiCommandConsole.showConsoleMessage(new ApiTimer(Cache._setup.setupTime).getDate("ISO"));
    Log.logAddEntry("===============================================");
    Log.logAddEntry("===============================================");
    Log.logAddEntry(LOG_MESSAGES.SETUP_NAME + Cache._setup.setupName + "  =");
    Log.logAddEntry(
      LOG_MESSAGES.SETUP_VERSION + Cache._setup.version
    );
    Log.logAddEntry(
      LOG_MESSAGES.SETUP_DATE +
      new ApiTimer(Cache._setup.setupTime).getDate("ISO") +
      "  ="
    );
    Log.logAddEntry("===============================================");
    Log.logAddEntry("===============================================");
  } catch (exception) {
    Log.logAddEntry(LOG_MESSAGES.IGNITION_FAIL, 3);
    throw exception;
  }
};
