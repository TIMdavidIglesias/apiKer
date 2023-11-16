import { Schema, model, Types } from 'mongoose';
import { ITracker } from './types';

// // Subesquema para el objeto "app"
// const appSchema: Schema = new Schema({
//   appID: { type: String, required: false },
//   // Otros campos relacionados con "app"
// }, { _id: false });

// // Subesquema para el objeto "controller"
// const controllerSchema: Schema = new Schema({
//   controllerName: { type: String, required: false },
//   controllerPath: { type: String, required: false },
//   controllerVersion: { type: String, required: false },
//   // Otros campos relacionados con "controller"
// }, { _id: false });

const errorSchema: Schema = new Schema({
  name: { type: String, required: true },
  exception: Schema.Types.Mixed,
  message: { type: String, required: true },
  time: { type: Number, required: true },
  additionalInfo: { type: String, required: false },
  // Otros campos relacionados con "error"
}, { _id: false });

// // Subesquema para el objeto "auth"
// const authSchema: Schema = new Schema({
//   requireAuthHeader: { type: Boolean, required: true },
//   header: { type: String, required: false },
//   // Otros campos relacionados con "auth"
// }, { _id: false });

// // Subesquema para el objeto "securityChecks"
// const securityChecksSchema: Schema = new Schema({
//   allowedMethodPassed: { type: Boolean, required: true },
//   securityCheckNativeCORSPassed: { type: Boolean, required: true },
//   securityCheckAllowedAppPassed: { type: Boolean, required: true },
//   securityCheckHostListFilteringPassed: { type: Boolean, required: true },
//   securityCheckRequiredDefaultHeadersPased: { type: Boolean, required: true },
//   securityCheckRequiredRouterParamsPased: { type: Boolean, required: true },
//   securityCheckRequiredRouterHeadersPased: { type: Boolean, required: true },
//   securityCheckProxyPassed: { type: Boolean, required: true },
//   securityCheckRequiredAuthHeadersPased: { type: Boolean, required: true },
//   // Otros campos relacionados con "securityChecks"
// }, { _id: false });

// const securitySchema: Schema = new Schema({
//   usingProxy: { type: Boolean, required: true },
//   usingNativeCORS: { type: Boolean, required: true },
//   usingHostListFiltering: { type: Boolean, required: true },
//   checks: { type: securityChecksSchema, required: true },
// }, { _id: false });

// // Subesquema para el objeto "request"
// const requestSchema: Schema = new Schema({
//   isTerminated: { type: Boolean, required: false },
//   IP: { type: String, required: false },
//   requestID: { type: String, required: true },
//   is404: { type: Boolean, required: true },
//   startTime: { type: Number, required: true },
//   endTime: { type: Number, required: true },
//   url: { type: String, required: true },
//   origin: { type: String, required: false },
//   headers: { type: Schema.Types.Mixed, required: false },
//   method: { type: String, required: true },
//   params: { type: Schema.Types.Mixed, required: false },
//   isPublicAccess: { type: Boolean, required: true },
//   // Otros campos relacionados con "request"
// }, { _id: false });

const resultSchema: Schema = new Schema({
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  success: { type: Boolean, required: true },
  // Otros campos relacionados con "result"
}, { _id: false });

const responseSchema: Schema = new Schema({
  code: { type: Number, required: true },
  // Otros campos relacionados con "response"
}, { _id: false });

const metadataSchema: Schema = new Schema({
  requestType: { type: String, required: true },
  inputs: {
    query: { type: Schema.Types.Mixed, required: false },
    body: { type: Schema.Types.Mixed, required: false },
    path: { type: Schema.Types.Mixed, required: false },
    header: { type: Schema.Types.Mixed, required: false },
    cookie: { type: Schema.Types.Mixed, required: false },
  },
  router: {
    method: { type: String, required: true },
    origin: { type: String, required: false },
    url: { type: String, required: true },
    CORS: { type: Boolean, default: false, required: true },
    discardCrossedRequests: { type: Boolean, default: false, required: true },
    requireAuth: { type: Boolean, default: false, required: true },
    requireSession: { type: Boolean, default: false, required: true },
    requiredIPFilter: { type: Boolean, default: false, required: true },
  },
  result: { type: resultSchema, required: false },
  response: { type: responseSchema, required: true },
  error: { type: errorSchema, required: false },
}, { _id: false });

export const requestTrackerSchema: Schema = new Schema({
  success: { type: Boolean, required: true },
  isError: { type: Boolean, required: false },
  metadata:  { type: metadataSchema, required: true },
});