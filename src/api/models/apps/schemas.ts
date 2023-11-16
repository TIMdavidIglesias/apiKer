// modules
import { Schema } from "mongoose";
import {
  IAppsAppAuthorization,
  IAppsCache,
  IAppsConfig,
  IAppsConfigCPController,
  IAppsConfigSession,
  IAppsConfigSessionPolicy,
  IAppsConfigSignup,
  IAppsConfigSignupAccountTypes,
  IAppsMetadata
} from "./types";

const apiSessionPolicySchema: Schema = new Schema<IAppsConfigSessionPolicy>({
  onExpiredToken: { type: String, required: true },
  requireFingerPrint: { type: Boolean, required: false },
  timeOutMinutes: { type: Number, required: true },
  rememberSession: {
    type: {
      allow: { type: Boolean, required: true },
      hoursTimeOut: { type: Number, required: true },
      param: { name: { type: String, required: true }, location: { type: String, required: true } }
    }, required: false
  }
  ,
}, { _id: false });

const apiAccountTypeSchema: Schema = new Schema<IAppsConfigSignupAccountTypes>({
  accountTypeId: { type: Number, required: true },
  name: { type: String, required: true },
}, { _id: false });

const apiSessionControllerSchema: Schema = new Schema<IAppsConfigCPController>({
  controllerName: { type: String, required: true },
  controllerPath: { type: String, required: true },
  controllerVersion: { type: String, required: true },
}, { _id: false });

const apiSessionSchema: Schema = new Schema<IAppsConfigSession>({
  usingServerCheckpoint: { type: Boolean, required: false },
  fingerPrintHeaderName: { type: String, required: false },
  sessionTokenName: { type: String, required: false },
  CSRFTokenHeaderName: { type: String, required: true },
  policy: { type: apiSessionPolicySchema, required: true },
  checkPointController: { type: apiSessionControllerSchema, required: true }
}, { _id: false });

const apiSignupSchema: Schema = new Schema<IAppsConfigSignup>({
  accountTypeDefaultID: { type: Number, required: true },
  accountTypes: { type: [apiAccountTypeSchema], required: true },
}, { _id: false });

const apiConfigSchema: Schema = new Schema<IAppsConfig>({
  session: { type: apiSessionSchema, required: true }, // Utiliza el esquema sessionSchema que definimos anteriormente
  signup: { type: apiSignupSchema, required: true },
}, { _id: false });

const apiMetadataSchema: Schema = new Schema<IAppsMetadata>({
  isActive: { type: Boolean, required: true },
  creationDate: { type: Date, required: true },
  updatedDate: { type: Date, required: false },
  appID: { type: String, required: true },
}, { _id: false });

const apiAppAuth: Schema = new Schema<IAppsAppAuthorization>({
  secretToken: { type: String, required: true },
}, { _id: false });

export const appsSC: Schema = new Schema<IAppsCache>({
  metadata: { type: apiMetadataSchema, required: true },
  targetDocServer: { type: Boolean, required: false },
  group: { type: String, required: true },
  isDefault: { type: Boolean, required: false },
  appName: { type: String, required: true },
  allowedOrigin: { type: String, required: true },
  whiteListedHosts: { type: [String], required: false },
  blackListedHosts: { type: [String], required: false },
  hostListPriority: { type: String, required: false },
  useHostListFilter: { type: Boolean, required: false },
  // virtualServer: { type: apiVirtualServerSchema, required: true },
  adminEmail: { type: String, required: true },
  applicationSecretToken: { type: String, required: true },
  encryptionKey: { type: String, required: true },
  applicationSecretTokenRefresh: { type: String, required: true },
  config: { type: apiConfigSchema, required: true },
  authorization: { type: apiAppAuth, required: true },
});