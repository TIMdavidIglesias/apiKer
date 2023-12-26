import { Model, model } from "mongoose";
import { klkAuthDoc } from './document'
import { apiKLKTempAutheSc } from './schemas'

export const KerLockerAuthModel: Model<klkAuthDoc> =
model<klkAuthDoc>('kerLocker', apiKLKTempAutheSc);