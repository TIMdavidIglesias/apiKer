// modules
import path from 'path';

// CORE
import { IEnv } from '../../src/ker/models/env/types';

// CONSTANTS
const SRCDIRNAME = path.resolve(__dirname, '../../') + '/';

export const _env: IEnv = {
    connection: {
        // production port for server listening
        portDefault: 8080,

        // UAT/test por for non-production purposes
        portAlternative: 5000,

        // Server domain for external access
        // serverDomain apply to the SwaggerDoc endpoint.
        // set as localhost:port for area networks
        serverDomain: 'https://api.heptacore.org',

        // Host name for server running
        // use localhost:port for area networks
        // hostName: 'localhost',

        // SSL secure certFiles for non-proxy secure connections
        // ssl:{
        //     privateKey:'',
        //     certificate:'',
        //     ca:''
        // }
    },
    // log name for the log files
    logFileName: 'log.log',
    // root dir name of the app
    dirName: SRCDIRNAME + 'src/',
    // controllers
    controllerDirectory: SRCDIRNAME + 'api/controllers/',
    // directory of the log
    logDirectory: SRCDIRNAME + '.log/',
    // directory where the documentation assets are stored
    isProduction: false,
    // level of message showing
    silentLevel: 0,
    // TaskManager
    startDefaultTasks: true
}