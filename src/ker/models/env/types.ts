export interface IEnv {
  connection: {
    portDefault: number,
    portAlternative?: number,
    hostName?: string,
    serverDomain?: string,
    usingSSL?: boolean,
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
