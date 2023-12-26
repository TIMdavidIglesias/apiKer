import { Model, model } from "mongoose";
import { databaseDoc } from "./document"
import { mongoDatabaseSc } from "./schemas";

export const MongoDatabaseModel: Model<databaseDoc> =
model<databaseDoc>('_database', mongoDatabaseSc);
