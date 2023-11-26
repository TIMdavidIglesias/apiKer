// modules
import fs from 'fs'
import path from 'path'

// ERROR & GLOSSARY
import { IApiErrorDefinition } from '../../../models/error/glossary/types';

// GLOSSARY DEFINITIONS
// - core
import defaultErrorGlossary from './error';
import envErrorGlossary from '../../env/error';
import logErrorGlossary from '../../log/error'
import mongoDatabasesErrorGlossary from '../../databases/mongo/error';
// - ignition
import apiIgnitionErrorGlossary from '../../../ignition/error';
// - api
import apiAppsErrorGlossary from '../../../../api/core/apps/error';
import apiRouterErrorGlossary from '../../../../api/core/router/error';
import apiHeadersErrorGlossary from '../../../../api/core/headers/error';
import apiControllerErrorGlossary from '../../../../api/core/controllers/error';
import apiControllerArgsValidatorErrorGlossary from '../../../../api/core/controllers/args/error';
import apiResponseTrackerErrorGlossary from '../../../../api/core/response/error';
// - tasks
import coreTasksErrorGlossary from '../../../../tasks/error';
// - swaggerDocs
import swaggerDocsErrorGlossary from '../../../../modules/swaggerDocs/error';

// METADATA VALIDATION
import { Cache } from '../../cache';
import { ignitionExceptionHandler } from '../connectors/ignition';
import { IApiError } from '../../../models/error/types';
import { ApiError } from '..';

// // AUTH
import kerLockerAuthErrorGlossary from '../../../../api/core/auth/error';

// MODULES
// G6
// import G6ErrorGlossary from '../../../gSix/error';

export class ErrorGlossary {

    // The array that holds the error definitions in the glossary
    private static errorGlossary: IApiErrorDefinition[];

    /**
     * Load Default Errors
     * Loads the default error definitions into the error glossary.
     * The default error glossary includes definitions from various error modules like 'error', 'mongo', 'ApiLog', etc.
     */
    public static glossaryLoadDefaults(): void {
        ErrorGlossary.errorGlossary = [
            // default
            ...defaultErrorGlossary,
            ...envErrorGlossary,

            // ignition
            ...apiIgnitionErrorGlossary,

            // core
            ...logErrorGlossary,
            ...mongoDatabasesErrorGlossary,

            // api
            ...apiAppsErrorGlossary,
            ...apiRouterErrorGlossary,
            ...apiHeadersErrorGlossary,
            ...apiControllerErrorGlossary,
            ...apiResponseTrackerErrorGlossary,
            ...apiControllerArgsValidatorErrorGlossary,

            // tasks
            ...coreTasksErrorGlossary,

            // swaggerDocs
            ...swaggerDocsErrorGlossary,

            ...kerLockerAuthErrorGlossary
            // ...ApiFormsErrorGlossary,
            // ...kerLockerAuthErrorGlossary
            // ...G6ErrorGlossary
        ];
    }

    /**
     * Get Error Definition by Name
     * Retrieves an error definition from the glossary based on the provided error name.
     * If the error name is not found in the glossary, a generic 500 internal server error definition is returned.
     * @param errorName - The name of the error for which to retrieve the definition.
     * @returns The error definition object containing error details like name, message, public message, etc.
     */
    public static getErrorDefinitionByName(errorName: string): IApiErrorDefinition {
        // Find the error definition from the glossary based on the error name
        const errorDefinition = ErrorGlossary.errorGlossary.find((error: IApiErrorDefinition) => error.name === errorName);

        // If error definition not found, return a generic 500 internal server error definition
        if (!errorDefinition) {
            const notFoundErrorDefinition: IApiErrorDefinition = {
                name: 'ERR_DEFINITION_ERROR_NOT_FOUND_IN_GLOSSARY',
                message: 'Error not defined in the error glossary',
                publicMessage: 'Internal error in the server',
                errorCode: 500,
            };

            return notFoundErrorDefinition;
        }

        // Error definition found, return it
        return errorDefinition;
    }

    public static getAllErrorDefinitions(): IApiErrorDefinition[] {
        return ErrorGlossary.errorGlossary;
    }

    public static async loadDynamicControllerErrorGlossary(dir: string = '') {
        const controllerDir = dir === '' ? Cache._env.controllerDirectory : dir
        try {
            const files = await fs.promises.readdir(controllerDir);

            for (const file of files) {
                const fRoute = path.join(controllerDir, file);
                const stst = await fs.promises.stat(fRoute);

                if (stst.isDirectory()) {
                    // Si es un directorio, realiza una búsqueda recursiva en el directorio.
                    await ErrorGlossary.loadDynamicControllerErrorGlossary(fRoute);
                } else if (file === 'error.json') {
                    const content = JSON.parse(await fs.promises.readFile(fRoute, 'utf8'));
                    ErrorGlossary.errorGlossary = [...ErrorGlossary.errorGlossary, ...content]
                }
            }
        } catch (error) {
            const errorDetails: IApiError = {
                name: 'ERR_DYNAMICALLY_LOADING_CONTROLLER_ERROR_GLOSSARY',
                exception: error,
                additionalInfo: ``
            };

            throw ignitionExceptionHandler(new ApiError(errorDetails))
        }

        return
    }
}
