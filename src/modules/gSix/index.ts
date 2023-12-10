import { GDoc } from "./gDoc";

export class gSix {

    private storage: {
        schemas: { [k: string]: any }
    }

    constructor() {
        this.storage = {
            schemas: {}
        }
    }

    public async createRecord(alias: string, values: Object = {}) {
        try {
            const r= new GDoc(alias, this.storage)
            return await r.executeCreateDocument(values)
        } catch (e) {
            throw {
                name: 'ERR_G6_CREATERECORD',
                exception: e,
            };
        }
    }

    public async readRecord(alias: string, queryName: string, values: Object = {}, limit: number=0, raw: boolean=true) {
        try {
            const r= new GDoc(alias, this.storage)
            return await r.executeReadDocument(queryName, values, limit, raw)
        } catch (e) {
            throw {
                name: 'ERR_G6_READRECORD',
                exception: e,
            };
        }
    }

    public async updateRecord(alias: string, queryName: string, criteria: Object = {}, values: Object = {}) {
        try {
            const r= new GDoc(alias, this.storage)
            return await r.executeUpdateDocument(queryName, criteria, values)
        } catch (e) {
            throw {
                name: 'ERR_G6_UPDATERECORD',
                exception: e,
            };
        }
    }
}
