// modules
import { Document } from "mongoose";

// types
import {
  IKerLockerTempAuth
} from './types';


export interface klkAuthDoc extends Document, IKerLockerTempAuth { }