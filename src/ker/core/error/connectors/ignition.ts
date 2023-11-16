// CORE
import { Log } from "../../../core/log";

// UTILS
import { ApiCommandConsole } from "../../../utils/console";

// ERROR
import { ApiError } from "../../../core/error";

const LOG_MESSAGES = {
  ERROR_DELIMITER: "=========> ERROR",
};

/**
 * Handles exceptions that occur during the API server ignition process. 
 * It displays the exception details on the console and logs them.
 * 
 * @param exception - The exception to be handled, typically an `ApiError`.
 * @param skipLog - A flag to indicate whether to skip logging the exception (default is false).
 */
export const ignitionExceptionHandler = (exception: ApiError, skipLog = false) => {
  ApiCommandConsole.showConsoleMessage(LOG_MESSAGES.ERROR_DELIMITER, 3);
  ApiCommandConsole.showConsoleMessage(exception.getErrorSummary());
  ApiCommandConsole.showConsoleMessage(LOG_MESSAGES.ERROR_DELIMITER, 3);

  // skipping log when an exception launched during a previous log recordingLog
  if (!skipLog) {
    Log.logAddEntry(LOG_MESSAGES.ERROR_DELIMITER);
    Log.logAddErrorEntry(exception);
    Log.logAddEntry(LOG_MESSAGES.ERROR_DELIMITER);
  }
};