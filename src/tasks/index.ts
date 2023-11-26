// ERROR
import { ApiError } from "../ker/core/error";
import { IApiError } from "../ker/models/error/types";

// TaskManager
import { newTask } from "./_wrapper";

// STATIC TASKS
import { logFileManager } from "./log";

/**
 * Executes default tasks as part of a background task manager.
 * 
 * @throws {ApiError} Throws an error if there's an issue executing the default tasks.
 */
export const executeDefaultTasks = async () => {
    try {
        // Managing log file
        // Schedule the log file manager task to run every 6 hours
        await newTask(logFileManager, 1000 * 3600 * 6); // 6 hrs

    } catch (exception) {
        // Error handling if an exception occurs during task execution
        // For example, if there's a permission issue
        const filePermissionError: IApiError = {
            name: 'ERR_TASK_FILESYSTEM',
            exception: exception,
        };
        // Wrap the error in an ApiError and re-throw it
        throw new ApiError(filePermissionError);
    }
}
