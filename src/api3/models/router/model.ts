import { Model, model } from "mongoose";
import { routerDoc, routerIgnoringDoc } from './document'
import { RouterSC, apiIgnoringRouteSc } from './schemas'

export const RouterModel: Model<routerDoc> =
model<routerDoc>('_router', RouterSC);

export const RouterIgnoringModel: Model<routerIgnoringDoc> =
model<routerIgnoringDoc>('_routerIgnoring', apiIgnoringRouteSc);