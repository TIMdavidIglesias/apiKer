import express, { Request, Response } from "express";
import axios from "axios";
import https from "https";
import cors from 'cors'

import { klkServer } from "./klkServer";

const app = express();

app.use(express.json());
app.use(cors({origin:klkServer.allowedOrigin}))

let publicAuthToken: any = {}

const authRequest = () => {

    const getAuth = async () => {
        try {
            const authres = await axios.get(`${klkServer.kerLockerURL}${klkServer.authRoute}`, options);
            publicAuthToken = authres.data
        } catch (error) {
            console.error('Error al obtener el código de autenticación:', error);
        }
        console.log(publicAuthToken)
    }

    const options: any = { headers: {} }
    options['headers'][klkServer.secretTokenHeaderName] = klkServer.secretToken
    options['headers']['agent'] = 'klkAuth'

    setInterval(async () => {
        getAuth()
    }, 60000)

    getAuth()
}

authRequest()

app.get('/auth/getAuthCode', (req: Request, res: Response) => {
    console.log(publicAuthToken)
    res.send(publicAuthToken)
});

app.listen(klkServer.port, (klkServer.hostName === 'localhost' ? '' : klkServer.hostName), () => {
    console.log(`kerLocker Auth client running at: ${klkServer.hostName === '' ? 'http://localhost' : klkServer.hostName}:${klkServer.port}`);
});