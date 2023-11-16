// ERROR
import { ApiError } from "../ker/core/error";
import { IApiError } from "../ker/models/error/types";

// TaskManager
import { newTask } from "./_wrapper";

// STATIC TASKS
import { logFileManager } from "./log";

export const executeDefaultTasks = async() => {
    try {
        // Managing log file
        await newTask(logFileManager, 1000*3600*6); // 6 hrs

    } catch (exception) {
        // Error due to permission
        const filePermissionError: IApiError = {
            name: 'ERR_TASK_FILESYSTEM',
            exception: exception,
        };
        throw new ApiError(filePermissionError);
    }
}


