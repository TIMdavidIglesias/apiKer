import { Model, model } from "mongoose";
import { AppsDoc } from './document'
import { appsSC } from './schemas'

export const AppsModel: Model<AppsDoc> =
model<AppsDoc>('_apps', appsSC);