export function criteriaConverter(object: any, objParams: { [k: string]: any } = {}): any {
   let o: any = {...object}
   
    if (typeof o !== 'object' || o === null) {
        // Si el object no es un object o es nulo, no hacemos nada
        return o;
    }

    for (const k in o) {
        if (o.hasOwnProperty(k)) {
            if (typeof o[k] === 'object' && o[k] !== null) {
                o[k] = criteriaConverter(o[k], objParams);
            } else if (k === 'operator' && o['param']) {
                const operador = o['operator'];
                const param = o['param'];

                // Removemos las propiedades 'operator' y 'param' y agregamos la nueva propiedad
                delete o['operator'];
                delete o['param'];
                o['$' + operador] = objParams[param];
            }
        }
    }

    return o;
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
                o[_kk] = {}
                typeDefiner(obj[_kk], o[_kk])
            }
        }
    }
}

export function valStructure(obj: any, objParams: any, o: any = {}, p: string = '', isUpdate: boolean = false) {
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
                        // o[k] = oo2
                        if (isUpdate) {
                            // o['$push'][`${obj[_kk]['tVal']}`] = Array.isArray(a)
                            //     ? { $each: a }
                            //     : a;
                            o['$push'][p+k] = oo2
                        } else {
                            // if (objParams[obj[_kk]['tVal']]) o[_kk] = objParams[obj[_kk]['tVal']]
                            o[k] = oo2
                        }
                    } else {
                        if (objParams[obj[_kk]['tVal']]) {
                            const a = objParams[obj[_kk]['tVal']]
                            // o[_kk] = Array.isArray(a) ? objParams[obj[_kk]['tVal']] : [objParams[obj[_kk]['tVal']]]

                            if (isUpdate) {
                                o['$push'][p+`${_kk}`] = Array.isArray(a)
                                    ? { $each: a }
                                    : a;
                            } else {
                                if (objParams[obj[_kk]['tVal']]) o[_kk] = objParams[obj[_kk]['tVal']]

                            }
                        }
                    }
                } else {
                    if (isUpdate) {
                        if (objParams[obj[_kk]['tVal']]) o['$set'][_kk] = objParams[obj[_kk]['tVal']]
                    } else {
                        if (objParams[obj[_kk]['tVal']]) o[_kk] = objParams[obj[_kk]['tVal']]

                    }
                    // if (objParams[obj[_kk]['tVal']]) o[_kk] = objParams[obj[_kk]['tVal']]
                }
            } else {
                const a: any = {}
                const d: any = {}
                valStructure(obj[_kk], objParams, a,p+p===''?'':'.'+_kk, isUpdate)

                if (_kk.startsWith('_')) {
                    if (isUpdate) {
                        // if (Object.keys(a).length > 0) o['$push'][_kk] = a
                        o['$push'][p+`${_kk}`] = Array.isArray(a)
                        ? { $each: a }
                        : a;
                    } else {
                        if (Object.keys(a).length > 0) o[_kk] = a

                    }
                } else {
                    if (isUpdate) {
                        if (Object.keys(a).length > 0) o['$set'][_kk] = a
                    } else {
                        if (Object.keys(a).length > 0) o[_kk] = a

                    }
                }

                // if (Object.keys(a).length > 0) o[_kk] = a

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



