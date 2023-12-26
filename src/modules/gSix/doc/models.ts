export interface IG6DocSchemas {
    [k: string]: {
        properties: any,
        type: string
    }
}

export interface IG6DocFullSchemaInfo {
    headerName: string,
    schemas: IG6DocSchemas
}

