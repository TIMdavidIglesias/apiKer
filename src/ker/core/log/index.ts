// MODULES
import fs from "fs";

// UTILS
import { ApiTimer } from "../../utils/timer";
import { ApiCommandConsole } from "../../utils/console";

// ERROR
import { ApiError } from "../error";
import { IApiError } from "../../models/error/types";

// Define log messages as constants
const LOG_MESSAGES = {
    ERR_LOG_REGISTER_EVENTS: 'FATAL ERROR: The local log is unable to register events due to a error within the filesystem. The execution of the server remains ...',
};

export class Log {
    // Stored log file path
    public static logFilePath: string;
    public static logFileName: string;
    private static hasError: boolean = false

    /**
     * Adds a log entry with an optional silent level.
     *
     * @param message The message to log.
     * @param silentLevel The optional silent level (default is 0).
     */
    public static async logAddEntry(message: string, silentLevel: number = 0) {
        // Timestamp for the log record
        const timestamp: string = new ApiTimer().getDate('ISO') as string;

        // Formatted message ready for logging
        const logEntry = `[${timestamp}]: ${message}`;

        try {
            // The record gets logged
            if (Log.hasError) {
                ApiCommandConsole.showConsoleMessage(LOG_MESSAGES.ERR_LOG_REGISTER_EVENTS)
                return
            }
            ApiCommandConsole.showConsoleMessage(message)
            await Log.logProcessEntry(logEntry, silentLevel);
        } catch (exception) {
            Log.hasError = true
            ApiCommandConsole.showConsoleMessage(exception)
        }
    }

    /**
     * Adds an error log entry with an optional silent level.
     *
     * @param error The error to log.
     * @param silentLevel The optional silent level (default is 0).
     */
    public static logAddErrorEntry(error: ApiError, silentLevel: number = 0): void {
        // Timestamp for the log record
        const timestamp: string = new ApiTimer().getDate('ISO') as string;

        const errorSummary = error.getErrorSummary()

        // Formatted message ready for logging
        const logEntry =
            `===============================================\r\n
        [${timestamp}]: A new FATAL ERROR has ocurred while ignition.\r\n
        ERROR SUMMARY:\r\n
        Error Name: ${errorSummary.name}\r\n
        Message: ${errorSummary.message}\r\n
        Public Message: ${errorSummary.publicMessage}\r\n
        Fatal Process Message: ${errorSummary.additionalInfo}\r\n
        ===============================================\r\n`;

        try {
            // The record gets logged
            if (Log.hasError) {
                ApiCommandConsole.showConsoleMessage(LOG_MESSAGES.ERR_LOG_REGISTER_EVENTS)
                return
            }
            ApiCommandConsole.showConsoleMessage(error)
            Log.logProcessEntry(logEntry, silentLevel);
        } catch (exception) {
            Log.hasError = true
            ApiCommandConsole.showConsoleMessage(exception)
        }
    }

    /**
     * Processes and writes a log entry with an optional silent level.
     *
     * @param logEntry The log entry to process and write.
     * @param messageSilentLevel The optional silent level (default is 0).
     */
    private static async logProcessEntry(logEntry: string, messageSilentLevel: number = 0) {
        // Check if the log file exists
        if (fs.existsSync(`${Log.logFilePath}${Log.logFileName}`)) {
            try {
                // Check file permission for writing
                fs.accessSync(Log.logFilePath, fs.constants.W_OK);
            } catch (exception) {
                // Error due to permission
                const filePermissionError: IApiError = {
                    name: 'ERR_WRITING_FILESYSTEM_PERMISSION',
                    exception: exception,
                };
                throw new ApiError(filePermissionError);
            }

            try {
                // Log file gets updated
                Log.logWriteEntry(logEntry, messageSilentLevel);
            } catch (exception) {
                throw exception;
            }
        } else {
            // New log file creation, file not found
            // Timestamp for the new log file
            const timestamp: string = new ApiTimer().getDate('ISO') as string;

            // File log header
            let logHeader = `* * *  NEW LOG START  * * *\r\n[DATE]: ${timestamp}\r\n===============================================\r\n`;

            try {
                // Log file gets updated
                Log.logWriteEntry(logHeader, messageSilentLevel);
                Log.logWriteEntry(logEntry, messageSilentLevel);
            } catch (exception) {
                throw exception;
            }
        }
    }

    /**
      * Writes a log entry to the file with an optional silent level.
      *
      * @param message The log entry to write.
      * @param messageSilentLevel The optional silent level (default is 0).
      */
    private static logWriteEntry(message: string, messageSilentLevel: number): void {
        try {
            // Append the string to the log file
            fs.appendFileSync(`${Log.logFilePath}${Log.logFileName}`, message + '\r\n');
        } catch (exception) {
            const fileWriteError: IApiError = {
                name: 'ERR_WRITING_IN_FILESYSTEM_DIRS',
                exception: exception,
            };
            throw new ApiError(fileWriteError);
        }
    }
}
