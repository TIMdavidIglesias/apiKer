// modules
import { Express } from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { SwaggerTheme } from "swagger-themes";

// CORE
import { Cache } from "../../ker/core/cache";

// UTILS
import { ApiCommandConsole } from "../../ker/utils/console";

// SWAGGER DOCS
import { swaggerDocComposer } from "./composer";

/**
 * Runs the Swagger documentation setup on the specified Express app.
 * @param app The Express app.
 * @param docRoute The route at which the documentation will be served.
 * @param docsDir The directory path where the Swagger YAML file is located.
 */
export const runSwaggerDocs = (app: Express, docRoute: string): void => {
  const theme = new SwaggerTheme('v3');

  const options = {
    customJs: './uiSwagger.js',
    customCss: theme.getBuffer('feeling-blue')
  };

  const swaggerDocument: any = {
    openapi: '3.0.3',
    info: {
      title: Cache._setup.apiName,
      termsOfService: Cache._setup.termsOfService,
      contact: {
        email: Cache._setup.contact.email,
        name: Cache._setup.contact.name,
        url: Cache._setup.contact.url,
      },
      license: {
        name: Cache._setup.license.name,
        url: Cache._setup.license.url,
      },
      version: Cache._setup.version,

    },
    servers: [{ url: Cache._env.connection.serverDomain }]//appGetDocTargetServers().map((s)=>{return {url:s}}),
  }

  try {
    swaggerDocComposer(swaggerDocument)

    const callableFiles = [
      { file: '/assets/uiSwagger.js', partialURL: '/uiSwagger.js' },
      { file: '/assets/gsix.html', partialURL: '/gsix' },
      { file: '/assets/gsix.png', partialURL: '/gsix.png' },
      { file: '/assets/jsViewer.js', partialURL: '/jsViewer.js' },
      { file: '/assets/cubesbg.jpg', partialURL: '/cubesbg.jpg' },
    ]

    app.use(callableFiles.map((f) => `${docRoute}${f.partialURL}`), (req, res) => {
      const errDescription = `Missing SwaggerDoc file: ${docRoute + `/${req.baseUrl.split('/')[docRoute.split('/').length]}`}`
      const filePath = callableFiles.find(cF =>
      (docRoute + cF.partialURL.split('/').slice(0, docRoute.split('/').length).join('/')
        === docRoute + `/${req.baseUrl.split('/')[docRoute.split('/').length]}`
      ))?.file
      if (filePath) {
        // special files
        if (req.baseUrl.split('/')[docRoute.split('/').length] === 'gsix') {
          let spFile = fs.readFileSync(__dirname + filePath).toString()
          spFile = spFile.replace('/** $$gSSchemas */', 'var gSSchemas = ' +
            JSON.stringify(Cache._gSixDocumentation?.schemaHeaders))

          res.send(spFile)
        } else {
          // current files
          if (!fs.existsSync(__dirname + filePath)) {
            ApiCommandConsole.showConsoleMessage(errDescription)
            return res.status(404).send()
          }
          res.sendFile(filePath, { root: __dirname })
        }

      } else {
        const errDescription = `Missing SwaggerDoc file: ${docRoute + `/${req.baseUrl.split('/')[docRoute.split('/').length]}`}`
        ApiCommandConsole.showConsoleMessage(errDescription)
      }
    });

    app.use(docRoute, swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  } catch (ex) {
    console.log(ex)
  }
};