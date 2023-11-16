// MODULES
import { Document } from "mongoose";

// TYPES
import {
  ISetup,
} from './types';

export interface setupSCDoc extends Document, ISetup { }