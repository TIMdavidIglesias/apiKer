export function criteriaConverter(object: any, objParams: { [k: string]: any } = {}): any {
    if (typeof object !== 'object' || object === null) {
        // Si el object no es un object o es nulo, no hacemos nada
        return object;
    }

    for (const k in object) {
        if (object.hasOwnProperty(k)) {
            if (typeof object[k] === 'object' && object[k] !== null) {
                object[k] = criteriaConverter(object[k], objParams);
            } else if (k === 'operator' && object['param']) {
                const operador = object['operator'];
                const param = object['param'];

                // Removemos las propiedades 'operator' y 'param' y agregamos la nueva propiedad
                delete object['operator'];
                delete object['param'];
                object['$' + operador] = objParams[param];
            }
        }
    }

    return object;
}

export function typeDefiner(obj: any, o: any) {
    for (const _kk in obj) {
        if (obj.hasOwnProperty(_kk)) {

            if (obj[_kk].hasOwnProperty('type')) {
                const options: any = obj[_kk]['options']
                // obj[_kk] = {
                //     type: obj[_kk]['type'],
                //     required: options['required'] || false,
                //     unique: options['unique'] || false,
                //     usingParam: options['param'] ? true : false,
                //     tVal: options['param'],
                // }
                o[_kk] = {
                    type: obj[_kk]['type'],
                    required: options['required'] || false,
                    unique: options['unique'] || false,
                    usingParam: options['param'] ? true : false,
                    tVal: options['param'],
                    _options: options
                }
            } else {
                o[_kk] = {}
                typeDefiner(obj[_kk], o[_kk])
            }
        }
    }
}

export function schStructure(obj:any, property:any, currentPath = '', result:any = []) {
    for (const key in obj) {
        const newPath = currentPath ? currentPath + '.' + key : key;
        if (typeof obj[key] === 'object') {
            schStructure(obj[key], property, newPath, result);
        } else if (key === property) {
          result.push(newPath.split('.').slice(0,-1).join('.'));
        }
      }
      return result;


}


export function schemaParser(obj: any, sch: any) {
    for (const key in obj) {
        if (typeof obj[key] === "object" && Object.keys(obj[key]).length > 0 && !Array.isArray(obj[key])) {
            // Si el valor es un objeto y no un arreglo, llamamos a la función de forma recursiva
            schemaParser(obj[key], sch);
            // if (!key.startsWith("_")) sch[key] = obj[key]

            let aP: any = {}
            aP['$ref'] = '#/components/schemas/' + key
            obj[key] = aP; // Puedes realizar cualquier modificación aquí

            console.log(1)
        } else if (key.startsWith("_")) {
            // Si la clave comienza con "_", aplicamos la modificación


            let aP: any = {}
            aP['type'] = 'array'
            aP['items'] = {}
            aP['items']['$ref'] = '#/components/schemas/' + key
            obj[key] = aP; // Puedes realizar cualquier modificación aquí

        } else {
            sch[key] = obj[key][0]
        }
    }
}





