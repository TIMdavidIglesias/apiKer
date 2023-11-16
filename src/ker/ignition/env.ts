// CORE
import { Cache } from "../core/cache";
import { Log } from "../core/log";
import { envDefineObject } from "../core/env";

// UTILS
import { ApiCommandConsole } from "../utils/console";

// ERROR
import { ErrorGlossary } from "../core/error/glossary";

// SETUP
import { _env } from "../../../setup/metadata/_env";

const LOG_MESSAGES = {
  ENV_CHECK_SUCCESS: "Environment check successful.",
  ENV_OK_METADATA_PASSED: "ENV [OK] -> /metadata/_env [PASSED]",
  DEFAULT_ERROR_LOADED: "Default error definitions loaded.",
  LOG_FEATURES_ACTIVE: "Log features are active.",
  DYNAMIC_ERROR_GLOSSARY_LOADED_INFO: "Dynamic controller error added.",
  DYNAMIC_ERROR_GLOSSARY_LOADED_OK: "ERROR GLOSSARY [OK] -> dynamic loading: [PASSED]",
};

/**
 * Initializes the environment for the API server.
 * 
 * This function loads default error definitions, validates environment metadata inputs from setupData,
 * and sets up logging features and silent console message levels.
 */
export const initializeEnvironment = async () => {
  // Loading default error definitions
  ErrorGlossary.glossaryLoadDefaults();

  // the object ready to get cached gets composed
  Cache._env = envDefineObject(_env);

  // At this point, LOG features are on
  Log.logFilePath = Cache._env.logDirectory;
  Log.logFileName = Cache._env.logFileName;

  // sets the silent level for the console messages and alerts
  ApiCommandConsole.silentLevel = Cache._env.silentLevel || 0;

  await ErrorGlossary.loadDynamicControllerErrorGlossary();

  Log.logAddEntry(LOG_MESSAGES.DYNAMIC_ERROR_GLOSSARY_LOADED_INFO);
  Log.logAddEntry(LOG_MESSAGES.DYNAMIC_ERROR_GLOSSARY_LOADED_OK, 2);

  Log.logAddEntry("===============================================");
  Log.logAddEntry(LOG_MESSAGES.ENV_CHECK_SUCCESS);
  Log.logAddEntry(LOG_MESSAGES.ENV_OK_METADATA_PASSED, 2);
  Log.logAddEntry(LOG_MESSAGES.DEFAULT_ERROR_LOADED);
  Log.logAddEntry(LOG_MESSAGES.LOG_FEATURES_ACTIVE);
  Log.logAddEntry("===============================================");
};