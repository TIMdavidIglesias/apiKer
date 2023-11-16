// MODULES
import fs from 'fs'

// CORE
import { Cache } from "../../ker/core/cache";

export const logFileManager = () => {
    try {
        let fileSizeInBytes = fs.statSync(`${Cache._env.logDirectory}${Cache._env.logFileName}`);

        if (fileSizeInBytes.size > 10000000) {
            // new file

            let i: number = 0
            let iF: string[] = (fs.readdirSync(Cache._env.logDirectory) as string[]);
            iF.map(f => i++)

            fs.copyFileSync(`${Cache._env.logDirectory}${Cache._env.logFileName}`, `${Cache._env.logDirectory}${Cache._env.logFileName}_${i}`);
            fs.writeFileSync(`${Cache._env.logDirectory}${Cache._env.logFileName}`, '')
        }
    } catch (ex) {
        throw ex
    }
}