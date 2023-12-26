// modules
import { Schema } from "mongoose";
import { ISetupCache } from "./types";

export const setupSC: Schema = new Schema<ISetupCache>({
  setupName: { type: String, required: true },
  apiName: { type: String, required: true },
  title: { type: String, required: false },
  description: { type: String, required: false },
  setupTime: { type: Date, required: true },
  termsOfService: { type: String, required: false },
  contact: {
    name:{ type: String, required: false },
    email:{ type: String, required: false },
    url:{ type: String, required: false },
  },
  license: {
    name:{ type: String, required: false },
    url:{ type: String, required: false },
  },
  version: { type: String, required: true },
});