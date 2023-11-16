// MODULES
import { Document } from "mongoose";

// TYPES
import { IMongoDatabaseCache } from "./types";

export interface databaseDoc extends Document, IMongoDatabaseCache { }