import { Express } from "express";
import { Cache } from "../../ker/core/cache";
import { appGetBySecretToken } from "../../api/core/apps";
import { Randomizer } from "../../ker/utils/randomizer";
import { ApiTimer } from "../../ker/utils/timer";
import { IAppsCache } from "../../api/models/apps/types";

export const kerLockerSecurityServer = (app: Express, secureServerRoute: string): void => {
    try {
        app.use(secureServerRoute, (req, res, next) => {
            console.log(Cache._vars.security)
            const secretAppToken = req.headers[Cache._vars.security.kerLockerAuthHeaderName as string]
            if(!secretAppToken){
                // error
                return next()
            }
           

            const targetApp = appGetBySecretToken(secretAppToken as string)
            if(!targetApp){
                // error
                return next()
            }

            const publicToken= Randomizer.RandomString(64)
            const tmpAuth = {
                token: publicToken,
                creationTime: new ApiTimer().getDateObject()
            }

            if(!targetApp.authorization.__tmp_klk_app_public_tokens) targetApp.authorization.__tmp_klk_app_public_tokens = []
            targetApp.authorization.__tmp_klk_app_public_tokens.push(tmpAuth)

            return res.send({
                success: true,
                result: publicToken
            })
        });
    } catch (ex) {
        console.log(ex)
    }
};