// modules
import { Document } from "mongoose";

// types
import {
  IRouterCache, IRouterIgnoringCache
} from './types';


export interface routerDoc extends Document, IRouterCache { }
export interface routerIgnoringDoc extends Document, IRouterIgnoringCache { }