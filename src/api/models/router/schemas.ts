// modules
import mongoose, { Schema, Types } from "mongoose";
import {
  IRouterApiDocs,
  IRouterCache,
  IRouterController,
  IRouterControllersAllowed,
  IRouterMetadata,
  IRouterParamValidationProps,
  IRouterRequiredParams
} from "./types";

const booleanValSch: Schema = new Schema({ val: Boolean, error: String }, { _id: false });
const numValSch: Schema = new Schema({ val: Number, error: String }, { _id: false });
const strValSch: Schema = new Schema({ val: String, error: String }, { _id: false });
const mixedValSch: Schema = new Schema({ val: mongoose.Schema.Types.Mixed, error: String }, { _id: false });
const mixedArrValSch: Schema = new Schema({ val: [mongoose.Schema.Types.Mixed], error: String }, { _id: false });

const apiRouterApiDocResponse: Schema = new Schema({
  description: { type: String, required: false },
  code: { type: Number, required: false },
  headers: { type: Schema.Types.Mixed, required: false },
  content: { type: Schema.Types.Mixed, required: false },
  params: { type: Schema.Types.Mixed, required: false },
  errorList: { type: [String], required: false },
}, { _id: false })

const apiRouterRequiredParamsValidationProps: Schema = new Schema<IRouterParamValidationProps>({
  isEmail: { type: booleanValSch, required: false },
  isURL: { type: booleanValSch, required: false },
  isRequired: { type: booleanValSch, required: false },
  min: { type: numValSch, required: false },
  max: { type: numValSch, required: false },
  isInteger: { type: booleanValSch, required: false },
  isPositive: { type: booleanValSch, required: false },
  of: { type: mixedValSch, required: false },
  paramType: { type: strValSch, required: false },
}, { _id: false })

const apiRouterDocs: Schema = new Schema<IRouterApiDocs>({
  summary: { type: String, required: false },
  description: { type: String, required: false },
  operationId: { type: String, required: true },
  requestBody: {
    description: { type: String, required: false },
    content: { type: [String], required: true },
  },
  responses: { type: [apiRouterApiDocResponse], required: false },
  importParamErrors: { type: Boolean, required: false },
}, { _id: false })

const apiRouterRequiredParams: Schema = new Schema<IRouterRequiredParams>({
  name: { type: String, required: true },
  items: { type: Schema.Types.Mixed, required: false },
  location: { type: String, required: true },
  validation: { type: apiRouterRequiredParamsValidationProps, required: true },
  example: { type: String, required: false },
}, { _id: false });

const apiRouterControllerSchema: Schema = new Schema<IRouterController>({
  controllerName: { type: String, required: true },
  controllerPath: { type: String, required: true },
  controllerVersion: { type: String, required: true },
  CORS: { type: Boolean, required: false },
  CSRF: { type: Boolean, required: false },
  requiredParams: { type: [apiRouterRequiredParams], required: false },
  requiredHeaders: { type: [String], required: false },
  requireAuth: { type: Boolean, required: false },
  requireSession: { type: Boolean, required: false },
  apiDoc: { type:apiRouterDocs, required: false },
}, { _id: false });

const apiRouterControllersSchema: Schema = new Schema<IRouterControllersAllowed>({
  GET: { type: apiRouterControllerSchema, required: false },
  POST: { type: apiRouterControllerSchema, required: false },
  PUT: { type: apiRouterControllerSchema, required: false },
  DELETE: { type: apiRouterControllerSchema, required: false },
  HEAD: { type: apiRouterControllerSchema, required: false },
  OPTIONS: { type: apiRouterControllerSchema, required: false },
  PATCH: { type: apiRouterControllerSchema, required: false },
  CONNECT: { type: apiRouterControllerSchema, required: false },
  TRACE: { type: apiRouterControllerSchema, required: false },
  COPY: { type: apiRouterControllerSchema, required: false },
  LOCK: { type: apiRouterControllerSchema, required: false },
}, { _id: false });

const apiRouterMetadataSchema: Schema = new Schema<IRouterMetadata>({
  label: { type: String, required: true },
  tag: { type: String, required: true },
  routerID: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  creationDate: { type: Date, required: true },
  updatedDate: { type: Date, required: false },
}, { _id: false });

export const RouterSC: Schema = new Schema<IRouterCache>({
  route: { type: String, required: true },
  requireAuth: { type: Boolean, required: false },
  requireSession: { type: Boolean, required: false },
  CORS: { type: Boolean, required: false },
  CSRF: { type: Boolean, required: false },
  controllers: { type: apiRouterControllersSchema, required: false },
  metadata: { type: apiRouterMetadataSchema, required: true },
})