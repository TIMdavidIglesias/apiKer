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
                o[_kk] = {
                    type: obj[_kk]['type'],
                    required: options['required'] || false,
                    unique: options['unique'] || false,
                    usingParam: options['param'] ? true : false,
                    tVal: options['param'],
                    _options: options
                }
            } else {
                o[_kk]={}
                typeDefiner(obj[_kk],o[_kk])
            }
        }
    }
}

export function valStructure(obj: any, objParams: any, o: any = {}) {
    for (const _kk in obj) {
        if (obj.hasOwnProperty(_kk)) {

            if (obj[_kk].hasOwnProperty('type')) {
                const options: any = obj[_kk]['options']
                if (_kk.startsWith('_')) {
                    if (typeof objParams[obj[_kk]['tVal']] === 'object') {
                        const oo2: any = {}
                        const oP = objParams[obj[_kk]['tVal']]

                        const k = '$' + oP.operator
                        const v = oP.val

                        oo2[_kk] = v
                        o[k] = oo2
                    } else {
                        if (objParams[obj[_kk]['tVal']]) {
                            const a = objParams[obj[_kk]['tVal']]
                            o[_kk] = Array.isArray(a) ? objParams[obj[_kk]['tVal']] : [objParams[obj[_kk]['tVal']]]
                        } 
                    }
                } else {
                    if (objParams[obj[_kk]['tVal']]) o[_kk] = objParams[obj[_kk]['tVal']]
                }
            } else {
                const a: any = {}
                const d: any = {}
                valStructure(obj[_kk], objParams, a)

                if (Object.keys(a).length > 0) o[_kk] = a

            }
        }
    }
}


export function schemaParser(obj: any, prefix = '_') {
    const keys: string[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {

            if (typeof obj[key] === 'object') {
                const nestedKeys = schemaParser(obj[key], prefix);
                keys.push(...nestedKeys.map(nestedKey => `${key}.${nestedKey}`));
            }

            if (key.startsWith(prefix)) {
                obj[key] = { type: [obj[key]] }
                keys.push(key);
            }
        }
    }

    return keys;
}



