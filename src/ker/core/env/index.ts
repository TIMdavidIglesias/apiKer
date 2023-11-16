// CACHE
import { Cache } from "../cache";
// - types
import { IEnv, 
    IEnvCache } from "../../models/env/types";

/**
 * Defines an object for caching environment data.
 *
 * @param env The environment data to be cached.
 * @returns The environment data in a format ready for caching.
 */
export const envDefineObject = (env: IEnv): IEnvCache => {
    const mode = env.isProduction === undefined || env.isProduction ? 'PRODUCTION' : 'UAT';
    const apiEnv: IEnvCache = {
        ...env,
        mode: mode,
    };

    return apiEnv;
}

/**
 * Composes the log file path for environment data.
 *
 * @returns The full log file path based on cached environment data.
 */
export const envGetLogFilePath = (): string => {
    const { logDirectory, logFileName } = Cache._env;
    return `${logDirectory}${logFileName}`;
}