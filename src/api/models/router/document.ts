// modules
import { Document } from "mongoose";

// types
import {
  IRouterCache
} from './types';


export interface routerDoc extends Document, IRouterCache { }
