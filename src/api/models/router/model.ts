import { Model, model } from "mongoose";
import { routerDoc } from './document'
import { RouterSC } from './schemas'

export const RouterModel: Model<routerDoc> =
model<routerDoc>('_router', RouterSC);
