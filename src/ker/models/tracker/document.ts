// modules
import { Document } from "mongoose";

// types
import {
  ITracker,
} from './types';

export interface requestTrackerDocument extends Document, ITracker { }