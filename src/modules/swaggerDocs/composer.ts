// CORE
import { Cache } from "../../ker/core/cache"

// API
import { appGetDefault } from "../../api/core/apps"
import { getPathParamList } from "../../api/core/router"
// - types
import {
    IRouterController,
    IRouterRequiredParams
} from "../../api/models/router/types"
import { ErrorGlossary } from "../../ker/core/error/glossary"

export const swaggerDocComposer = (swaggerDocument: any) => {

    const defaultApp = appGetDefault()

    let requestSchemaB: any = { properties: {} }
    let requestSchemaR: any = { properties: {} }
    let validationErrors: any = {}

    let path: any = {}
    let serverInfo: any = { headers: [], auth: [] }


    swaggerDocument['components'] = {}
    swaggerDocument['components']['schemas'] = {}

    for (const r of Cache._router) {
        if (r.metadata.tag !== 'apidoc') {
            path[r.route] = {}
            r.controllers && Object.entries(r.controllers as IRouterController).forEach(([k, controller]: [string, any]) => {
                if (k !== k.toUpperCase()) return;

                if (!path[r.route]) {
                    path[r.route] = {};
                }

                const pathParams = getPathParamList(r.route)

                path[r.route][k.toLowerCase()] = {}
                path[r.route][k.toLowerCase()] = {
                    tags: [r.metadata.tag],
                    summary: controller.apiDoc.summary,
                    description: controller.apiDoc.description,
                    operationId: controller.apiDoc.operationId,
                    parameters: [
                        ...pathParams.map((rP: any) => ({
                            name: rP,
                            in: 'path',
                            required: true,
                            schema: {
                                type: rP.validation?.paramType.val || 'string',
                                format: rP.validation?.paramType.format || ''
                            },
                        })),
                        ...controller.requiredParams
                            .filter((p: any) => p.location !== 'body' && p.location !== 'path')
                            .map((p: any) => ({
                                name: p.name,
                                in: p.location,
                                required: true,
                                schema: {
                                    type: p.validation?.paramType.val || 'string',
                                    format: p.validation?.paramType.format || ''
                                },
                            })),
                        // ...(r.requireAuth || controller.requireAuth
                        //     ? [
                        //         {
                        //             name: 'api-token',
                        //             in: 'header',
                        //             required: true,
                        //             schema: {
                        //                 type: 'string',
                        //             },
                        //         },
                        //     ]
                        //     : []),

                    ],
                    requestBody: {
                        description: '',
                        content: (() => {
                            let params: any = {}
                            let currentDefErrors: string[] = []

                            if (!controller.apiDoc.requestBody.content) return
                            controller.apiDoc.requestBody.content.forEach((c: any, i: number) => {
                                controller.requiredParams.forEach((p: IRouterRequiredParams, j: number) => {
                                    if (p.location === 'body') {
                                        requestSchemaB['properties'][p.name] = {
                                            type: p.validation?.paramType?.val || 'string',
                                            typeError: p.validation?.paramType?.error,
                                            example: p.example || '',
                                            required: p.validation?.isRequired?.val,
                                            requiredError: p.validation?.isRequired?.error,
                                        }
                                    }

                                    controller.apiDoc.importParamErrors !== false && Object.entries(p.validation).forEach((pV: any, k: number) => {
                                        const errDef = ErrorGlossary.getErrorDefinitionByName(pV[1].error)

                                        if (errDef.name !== 'ERR_DEFINITION_ERROR_NOT_FOUND_IN_GLOSSARY') {
                                            if (!currentDefErrors.includes(errDef.name)) {
                                                currentDefErrors.push(errDef.name)
                                                validationErrors[`${errDef.errorCode}${i}${j}${k}_X`] = { description: `${errDef.name}` }
                                            }
                                        }
                                    })
                                })
                                params[c] = { schema: { $ref: `#/components/schemas/${controller.apiDoc.operationId}_b` } }

                                swaggerDocument.components.schemas = { ...swaggerDocument.components.schemas }
                                swaggerDocument.components.schemas[controller.apiDoc.operationId + '_b'] = requestSchemaB
                                requestSchemaB = { properties: {} }
                            })

                            return params
                        })()
                    },

                    responses: (() => {
                        let resArr: any = {}
                        let currentDefErrors: string[] = []

                        controller.apiDoc.responses.forEach((rp: any, i: number) => {
                            if (rp['code']) {
                                resArr[`${rp['code']}${i}_O`] = rp
                                if (controller.requireAuth || r.requireAuth) {
                                    if (!resArr[`${rp['code']}${i}_O`]['headers']) resArr[`${rp['code']}${i}_O`]['headers'] = {}
                                    resArr[`${rp['code']}${i}_O`]['headers'][Cache._vars.security.kerLockerSessionHeaderName] = {
                                        description: 'Session token authorized for the user',
                                        schema: { type: 'string' }
                                    }
                                }

                                if (rp.params) {
                                    const rpP = rp.params
                                    rp.params = {}
                                    for (const param of rpP) {
                                        requestSchemaR['properties'][param.name] = {
                                            type: param.paramType?.val || 'string',
                                        }

                                        rp.params[param] = { schema: { $ref: `#/components/schemas/${controller.apiDoc.operationId}_r` } }
                                    }
                                }

                                if (rp.content) {
                                    const rpC = rp.content
                                    rp.content = {}
                                    for (const content of rpC) {
                                        rp.content[content] = { schema: { $ref: `#/components/schemas/${controller.apiDoc.operationId}_r` } }
                                    }

                                    swaggerDocument.components.schemas = { ...swaggerDocument.components.schemas }
                                    swaggerDocument.components.schemas[controller.apiDoc.operationId + '_r'] = requestSchemaR

                                    requestSchemaR = { properties: {} }
                                }

                            } else {
                                rp['errorList'].forEach((e: string, j: number) => {
                                    const errDef = ErrorGlossary.getErrorDefinitionByName(e)
                                    if (errDef.name !== 'ERR_DEFINITION_ERROR_NOT_FOUND_IN_GLOSSARY') {
                                        if (!currentDefErrors.includes(errDef.name)) {
                                            currentDefErrors.push(errDef.name)
                                            resArr[`${errDef.errorCode}${i}${j}_XX`] = { description: `${errDef.name}` }
                                        }
                                    }
                                })
                            }
                        })

                        return { ...resArr, ...validationErrors }
                    })()
                }

                if (r.requireAuth) {
                    path[r.route][k.toLowerCase()]['security'] = [{ kerLocker: [] }]
                } else if (r.metadata.label === 'AuthServer') {
                    path[r.route][k.toLowerCase()]['security'] = [{ serverAuth: [] }]
                }

            })
        }
    }

    swaggerDocument.paths = { ...swaggerDocument.paths, ...path }

    // securitySchemes
    swaggerDocument.components.securitySchemes = {
        'serverAuth': { type: 'apiKey', name: 'api-secret', in: 'header' },
        'kerLocker': { type: 'apiKey', name: 'api-token', in: 'header' }
    }
}