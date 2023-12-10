import { Schema } from 'mongoose';

const ErrorSchema: Schema = new Schema({
  name: { type: String, required: true },
  exception: Schema.Types.Mixed,
  message: { type: String, required: true },
  time: { type: Number, required: true },
  additionalInfo: { type: String, required: false },
}, { _id: false });

const SecurityChecksSchema: Schema = new Schema({
  allowedMethodPassed: { type: Boolean, required: true },
  securityCheckProxyPassed: { type: Boolean, required: true },
  securityCheckRouterIsActive: { type: Boolean, required: true },
  securityCheckAuthToken: { type: Boolean, required: true },
  securityCheckRequiredRouterParamsPassed: { type: Boolean, required: true },
  controllerExecutionSuccess: { type: Boolean, required: true },
  sessionAlive: { type: Boolean, required: true },
}, { _id: false });

const ResultSchema: Schema = new Schema({
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  success: { type: Boolean, required: true },
}, { _id: false });

const ResponseSchema: Schema = new Schema({
  code: { type: Number, required: true },
  // Otros campos relacionados con "response"
}, { _id: false });

const MetadataSchema: Schema = new Schema({
  requestType: { type: String, required: true },
  proxyFlag: { type: String, required: false },
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
    requireAuth: { type: Boolean, default: false, required: true },
    requireSession: { type: Boolean, default: false, required: true },
    requiredIPFilter: { type: Boolean, default: false, required: true },
  },
  result: { type: ResultSchema, required: false },
  response: { type: ResponseSchema, required: true },
  error: { type: ErrorSchema, required: false },
  securityChecks: { type: SecurityChecksSchema, required: false },
}, { _id: false });

export const requestTrackerSchema: Schema = new Schema({
  success: { type: Boolean, required: true },
  isError: { type: Boolean, required: false },
  metadata:  { type: MetadataSchema, required: true },
});