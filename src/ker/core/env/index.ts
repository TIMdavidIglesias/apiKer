import fs from 'fs'

// CACHE
import { Cache } from "../cache";
// - types
import {
    IEnv,
    IEnvCache
} from "../../models/env/types";
import { IApiError } from '../../models/error/types';
import { ApiError } from '../error';

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
 * Retrieves the content of a certificate file based on the provided path.
 * @param certPath The path to the certificate file.
 * @returns The content of the certificate file as a string.
 * @throws {ApiError} Throws an error if the certificate file is not accessible.
 */
export const envGetCert = (certPath: string) => {
    try {
        // Read and return the content of the certificate file
        return fs.readFileSync(`${Cache._env.dirName}${certPath}`, 'utf8');
    } catch (ex) {
        // Handle error if the certificate file is not accessible
        const myError: IApiError = {
            name: 'ERR_CERT_FILE_NOT_ACCESSIBLE',
            additionalInfo: `Error in file: ${Cache._env.dirName}${certPath}`,
        };

        throw new ApiError(myError);
    }
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