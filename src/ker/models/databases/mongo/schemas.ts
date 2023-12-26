// MODULES
import { Schema } from "mongoose";

// TYPES
import { IMongoDatabaseAuth, IMongoDatabase, IMongoDatabaseConnectionOptions, IMongoDatabaseHost, IMongoDatabaseMetadata } from "./types";

const authSchema = new Schema<IMongoDatabaseAuth>({
  username: { type: String, required: true },
  password: { type: String, required: false },
}, { _id: false });

const connectionOptionsSchema = new Schema<IMongoDatabaseConnectionOptions>({
  connectTimeoutMS: { type: Number, required: false },
  heartbeatFrequencyMS: { type: Number, required: false },
  useNewUrlParser: { type: Boolean, required: false },
  useUnifiedTopology: { type: Boolean, required: false },
}, { _id: false });
const host = new Schema<IMongoDatabaseHost>({
  host: { type: String, required: true },
  port: { type: Number, required: true },
}, { _id: false });

const metadata = new Schema<IMongoDatabaseMetadata>({
  dbRole: { type: String, required: false },
  defaultDB: { type: String, required: true },
  dbID: { type: String, required: true },
  creationDate: { type: Date, required: true },
  updatedDate: { type: Date, required: false },
  isActive: { type: Boolean, required: true },
}, { _id: false });

export const mongoDatabaseSc: Schema = new Schema<IMongoDatabase>({
  coreDBName: { type: String, required: true },
  host: { type: host, required: true },
  metadata: { type: metadata, required: true },
  auth: { type: authSchema, required: true },
  connectionOptions: { type: connectionOptionsSchema, required: false },
});