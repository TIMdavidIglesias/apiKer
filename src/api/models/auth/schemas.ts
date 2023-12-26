// modules
import mongoose, { Schema, Types } from "mongoose";
import { IKerLockerTempAuth } from "./types";

export const apiKLKTempAutheSc: Schema = new Schema<IKerLockerTempAuth>({
  token: { type: String, required: true },
  date: { type: Date, required: true }, 
  appID: { type: String, required: true }, 
  origin: { type: String, required: true }, 
  timeoutMins:{ type: Number, required: true },
})