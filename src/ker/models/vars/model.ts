import { Model, model } from "mongoose";
import { varSCDoc } from './document'
import { VarsSc } from './schemas'

export const VarsModel: Model<varSCDoc> =
model<varSCDoc>('_vars', VarsSc);