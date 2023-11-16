import { Schema } from "mongoose";

export type IGActionType = 'createRecord' | 'readRecord' | 'updateRecord' | 'deleteRecord'

export interface IGDoc {
    database: IGDatabase,
    fields: Object,
    metadata: IGMetadata,
    queries:
    {
        name: string,
        query: any
    }[],
}

// DATABASES
export interface IGDatabase {
    db: string;
    dbCollection: string;
    customDB?: string
}

// METADATA
export interface IGMetadata {
    alias: string,
    isActive: boolean,
    isDeleted?: boolean,
    creationTime?: number,
    lastUpdateTime?: number,
    deletionTime?: number,
    GDocName?: string,
    GDocID?: string
}