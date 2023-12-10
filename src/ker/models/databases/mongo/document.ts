// MODULES
import { Document } from "mongoose";

// TYPES
import { IMongoDatabase } from "./types";

export interface databaseDoc extends Document, IMongoDatabase { }