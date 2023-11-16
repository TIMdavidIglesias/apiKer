export interface IEnv {
  connection: {
    // production port for server listening
    portDefault: number,
    // UAT/test por for non-production purposes
    portAlternative?: number,
    hostName?: string,
    serverDomain?: string,
    ssl?: {
      privateKey: string,
      certificate: string,
      ca?: string
    }
  },
  dirName: string,
  controllerDirectory: string,
  logFileName: string,
  logDirectory: string,
  isProduction: boolean,
  silentLevel: number,
  startDefaultTasks: boolean,
}

export interface IEnvRunnung {
  isRunning?: boolean,
  mode: string
}

export type IEnvCache = IEnv & IEnvRunnung
