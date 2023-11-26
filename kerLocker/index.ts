// Import necessary modules
import express, { Request, Response } from "express";
import axios from "axios";
import cors from 'cors';

// Import klkServer configuration
import { klkServer } from "./klkServer";

// Create an Express application
const app = express();

// Use JSON parsing middleware
app.use(express.json());

// Enable CORS with the allowed origin from klkServer configuration
app.use(cors({ origin: klkServer.allowedOrigin }));

// Initialize a variable to store the public auth token
let publicAuthToken: any = {};

// Function to make an authentication request to the kerLocker server
const authRequest = () => {

    // Function to retrieve the authentication token from the kerLocker server
    const getAuth = async () => {
        try {
            // Make a GET request to the authentication route of the kerLocker server
            const authres = await axios.get(`${klkServer.kerLockerURL}${klkServer.authRoute}`, options);
            
            // Store the retrieved public auth token
            publicAuthToken = authres.data;
        } catch (error) {
            console.error('Error obtaining the authentication code:', error);
        }
        console.log(publicAuthToken);
    }

    // Set up options for the authentication request
    const options: any = { headers: {} }
    options['headers'][klkServer.secretTokenHeaderName] = klkServer.secretToken
    options['headers']['agent'] = 'klkAuth'

    // Set up an interval to regularly fetch the authentication token
    setInterval(async () => {
        getAuth();
    }, 60000);

    // Initial authentication request
    getAuth();
}

// Execute the authentication request function
authRequest();

// Route to expose the public auth token
app.get('/auth/getAuthCode', (req: Request, res: Response) => {
    console.log(publicAuthToken);
    res.send(publicAuthToken);
});

// Start the Express server
app.listen(klkServer.port, (klkServer.hostName === 'localhost' ? '' : klkServer.hostName), () => {
    console.log(`kerLocker Auth client running at: ${klkServer.hostName === '' ? 'http://localhost' : klkServer.hostName}:${klkServer.port}`);
});
