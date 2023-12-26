// ERROR
import { ApiError } from "..";

// CORE
import { Log } from "../../log";

/**
 * Handles uncaught exceptions and logs the exception details.
 * 
 * @param exception - The uncaught exception to be handled.
 * @returns An `ApiError` object representing the uncaught exception.
 */
export const uncatchedExceptionHandler = (exception: any, additionalInfo: string = ''): ApiError => {
  const error = new ApiError({
    name: 'ERR_NO_CATCHED_EXCEPTION',
    exception: exception,
    additionalInfo: additionalInfo
  });

  const errorSeparator = '==> EXCEPTION - NOT CATCHED <===';
  Log.logAddEntry(errorSeparator);
  Log.logAddErrorEntry(error, 3);
  Log.logAddEntry(errorSeparator);

  return error;
};