// modules
import { Schema } from "mongoose";
import {
  IVarsCache,
  IVarsDocumentation,
  IVarsRequestHeaders,
  IVarsSecurity,
  IVarsSecurityProxy,
  IVarsSession,
  IVarsTracing,
} from "./types";

const apiVarsSecurityProxySchema = new Schema<IVarsSecurityProxy>({
  usingProxy: { type: Boolean, required: true },
  clientIPHeaderName: { type: String, required: true },
  proxyFlagIdentifier: { type: String, required: true },
  allowInternalNetworkCollections: { type: Boolean, required: true },
}, { _id: false });

const apiVarsSecuritySchema = new Schema<IVarsSecurity>({
  discardCrossedRequests: { type: Boolean, required: true },
  saltGenerationRoundsNumber: { type: Number, required: true },
  authProtocol: { type: String, required: true },
  kerLockerSecretAuthHeaderName: { type: String, required: true },
  kerLockerPublicAuthHeaderName: { type: String, required: true },
  kerLockerCSRFHeaderName: { type: String, required: true },
  kerLockerSessionHeaderName: { type: String, required: true },
  proxy: { type: apiVarsSecurityProxySchema, required: true },
}, { _id: false });

const apiVarsTracesSchema = new Schema({
  tracePublicRequest: { type: Boolean, required: true },
  trace404Request: { type: Boolean, required: true },
  traceErrorRequest: { type: Boolean, required: true },
  traceSuccessRequest: { type: Boolean, required: true },
}, { _id: false });

const apiVarsTracingSchema = new Schema<IVarsTracing>({
  database: { type: String, required: false },
  traces: { type: apiVarsTracesSchema, required: true }
}, { _id: false });

const apiVarsDocumentationSchema = new Schema<IVarsDocumentation>({
  isActive: { type: Boolean, required: true },
  swaggerDocsRoute: { type: String, required: false },
}, { _id: false });

const apiVarsSessionSchema = new Schema<IVarsSession>({
  defaultControllerPermissionLevel: { type: Number, required: true },
  defaultAccountPermissionLevel: { type: Number, required: true },
}, { _id: false });

export const VarsSc: Schema = new Schema<IVarsCache>({
  tracing: { type: apiVarsTracingSchema, required: true },
  documentation: { type: apiVarsDocumentationSchema, required: true },
  security: { type: apiVarsSecuritySchema, required: true },
  session:{ type: apiVarsSessionSchema, required: true },
});