// modules
import { Document } from "mongoose";
import { IVarsCache } from "./types";

export interface varSCDoc extends Document, IVarsCache { }
