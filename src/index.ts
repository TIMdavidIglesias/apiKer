// MODULES
import { exit } from "process";

// UTILS
import { ApiTimer } from "./ker/utils/timer";

// ERROR
import { ApiError } from "./ker/core/error";
// - connectors
import { uncatchedExceptionHandler } from "./ker/core/error/connectors/uncatched";
import { ignitionExceptionHandler } from "./ker/core/error/connectors/ignition";

// CORE
import { Cache } from "./ker/core/cache";
import { Log } from "./ker/core/log";

// IGNITION
import { initializeEnvironment } from "./ker/ignition/env";
import { initializeMasterEnvironmentDatabase } from "./ker/ignition/masterDB";
import { initializeMasterEnvironmentSetup } from "./ker/ignition/setup";

// TASKMANAGER
import { executeDefaultTasks } from "./tasks";

// SERVER RUN
import { runServer } from "./server";

// Define log messages as constants
const LOG_MESSAGES = {
  STARTING_API_SERVER: "Starting API server...",
  IGNITION_TIME: "Ignition time: ",
  CONNECTING_TO_MASTER_DB: "Connecting to the master database...",
  CONNECTED_TO_MASTER_DB: "Connected to the master database successfully.",
  SETTING_UP_API_DATA: "Setting up API data...",
  API_DATA_SETUP_COMPLETED: "API data setup completed successfully.",
  TASKS_INIT: "Starting task manager.",
  TASKS_SKIPPING: "Skipping task manager.",
  TASKS_INIT_COMPLETED: "ask manager loaded successfully.",
};

/**
 * Initializes the core of the API server.
 * 
 * This function goes through several initialization steps, connects to the master database,
 * and sets up the API data. It also handles errors and exceptions that may occur during the process.
 */
export async function igniteKerCore() {
  try {
    // initializes the environment by loading the env variables and storing it in Cache.
    await initializeEnvironment();
    Log.logAddEntry(LOG_MESSAGES.STARTING_API_SERVER);
    Log.logAddEntry(
      LOG_MESSAGES.IGNITION_TIME + new ApiTimer().getDate("DD/MM/YYYY HH:mm:ss")
    );
  } catch (exception) {
    // Handle errors during initialization
    // If the exception is an ApiError, it's a critical error related to the file system.
    if (exception instanceof ApiError) {
      return ignitionExceptionHandler(exception, true);
    }

    // in case of non-catched exception (not ApiError), show exception
    uncatchedExceptionHandler(exception);
    exit();
  }

  try {
    // Connect to the master database
    Log.logAddEntry(LOG_MESSAGES.CONNECTING_TO_MASTER_DB);
    // initializes and connects to the master database.
    await initializeMasterEnvironmentDatabase();
    Log.logAddEntry(LOG_MESSAGES.CONNECTED_TO_MASTER_DB, 2);
  } catch (exception) {
    // Handle errors during master database connection
    // If the exception is an ApiError, it's a critical error related to starting the master database.
    if (exception instanceof ApiError) {
      return ignitionExceptionHandler(exception);
    }

    // in case of non-catched exception (not ApiError), show exception
    uncatchedExceptionHandler(exception);
    exit();
  }

  try {
    // Setup the API data
    Log.logAddEntry(LOG_MESSAGES.SETTING_UP_API_DATA);
    await initializeMasterEnvironmentSetup();
    Log.logAddEntry(LOG_MESSAGES.API_DATA_SETUP_COMPLETED, 2);
  } catch (exception) {
    // Handle errors during API data setup
    // If the exception is an ApiError, it's a critical error related to setting up metadata.
    if (exception instanceof ApiError) {
      return ignitionExceptionHandler(exception as ApiError);
    }

    // in case of non-catched exception (not ApiError), show exception
    uncatchedExceptionHandler(exception);
    exit();
  }

  // TASKS
  if (Cache._env.startDefaultTasks === true) {
    try {
      // Starting Tasks
      Log.logAddEntry(LOG_MESSAGES.TASKS_INIT);
      await executeDefaultTasks();
      Log.logAddEntry(LOG_MESSAGES.API_DATA_SETUP_COMPLETED, 2);
    } catch (exception) {
      // Critical error setting up metadata
      if (exception instanceof ApiError) {
        return ignitionExceptionHandler(exception as ApiError);
      }

      // in case of non-catched exception (not ApiError), show exception
      uncatchedExceptionHandler(exception);
      exit();
    }
  } else {
    Log.logAddEntry(LOG_MESSAGES.TASKS_SKIPPING, 2);
  }

  runServer();
}