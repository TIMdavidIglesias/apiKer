import { Model, model } from "mongoose";
import { requestTrackerDocument } from "./document"
import { requestTrackerSchema } from "./schemas";

export const TrackerModel: Model<requestTrackerDocument> =
model<requestTrackerDocument>('requests', requestTrackerSchema);