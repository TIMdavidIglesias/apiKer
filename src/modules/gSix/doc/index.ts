import { _dcs } from "../metadata/dcs";
import { schStructure } from "./core";
import { IG6DocFullSchemaInfo, IG6DocSchemas } from "./models";

export class gSixDocs {
    public schemaHeaders: IG6DocFullSchemaInfo[]

    constructor() {
        this.schemaHeaders = []
        let strPaths: string[] = []

        let i = 0
        for (const gsDoc of _dcs) {

            let schemaHeader: IG6DocFullSchemaInfo = { headerName: gsDoc.metadata.alias, schemas: {} }

            strPaths = schStructure(gsDoc.fields, 'type')
            const strPathsArray = schStructure(gsDoc.fields, 'type').map((path: string) => {
                const parts = path.split('.');
                for (let i = 0; i < parts.length; i++) {
                    if (parts[i].startsWith('_') && parts.length > 1) {
                        parts[i] = parts[i] + '.0';
                    }
                }
                return parts.join('.');
            });

            function createNestedObjectFromPaths(paths: string[]) {
                const result = {};

                let i =0
                for (const path of paths) {
                    const segments = path.split('.');
                    let current: any = result;
                   
                    for (const segment of segments) {
                        if (!current[segment]) {
                            if (segment.startsWith('_')) {
                                if(segment === segments[segments.length-1] ){
                                    current[segment] = `arr[${eval('gsDoc.fields.' + strPaths[i] + '.type')}]` 
                                }else{
                                    current[segment] =  []

                                }
                            } else {
                                if(segment === segments[segments.length-1] ){
                                    current[segment] = `${eval('gsDoc.fields.' + strPaths[i] + '.type')}` 
                                }else{
                                    current[segment] =  {}

                                }
                            }
                           
                        }
                        current = current[segment];
                    }

                    i++
                }

                return result;
            }

            const nestedObject = createNestedObjectFromPaths(strPathsArray);
            console.log(nestedObject);

            schemaHeader['schemas'] = (nestedObject)
            this.schemaHeaders.push(schemaHeader)
        }
    }
}