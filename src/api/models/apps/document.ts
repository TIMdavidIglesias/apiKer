// modules
import { Document } from "mongoose";

// types
import { IAppsCache } from "./types";

export interface AppsDoc extends Document, IAppsCache { }
