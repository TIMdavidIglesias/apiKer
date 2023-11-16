import { ISetup } from "../../src/ker/models/setup/types";

export const _setup: ISetup =
{
    // internal name of the installation
    setupName: 'heptaCore_1000_dev',

    // service name. Has effects over SwaggerDocs
    apiName: 'apiKer',

    // tithe name. Has effects over SwaggerDocs
    title: 'A simple way to create an API',

    // short description of the service. Has effects over SwaggerDocs
    description: 'A simple way to create an API',

    // terms of the service. Has effects over SwaggerDocs
    termsOfService: 'http://swagger.io/terms/',

    // webmaster contact. Has effects over SwaggerDocs
    contact: {
        name: 'David Iglesias Alonso',
        email: 'mail@timdevelopers.com',
        url: 'http://swagger.io/terms/',
    },

        // License data. Has effects over SwaggerDocs
    license: {
        name: 'Apache 2.0',
        url: 'http://swagger.io/terms/',
    },

            // Api version. Has effects over SwaggerDocs
    version: '1.0.0.0',
}