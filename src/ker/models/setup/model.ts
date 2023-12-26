import { Model, model } from "mongoose";
import { setupSCDoc  } from "./document"
import { setupSC } from "./schemas";

export const SetupModel: Model<setupSCDoc> =
model<setupSCDoc>('_setup', setupSC);