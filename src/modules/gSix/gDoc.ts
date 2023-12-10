import mongoose from "mongoose"
import { _dcs } from "./metadata/dcs"

import { IGDoc } from "./models"
import { criteriaConverter, schemaParser, typeDefiner, valStructure } from "./core"
import { IMongoDatabase } from "../../ker/models/databases/mongo/types"
import { getDatabaseByName } from "../../ker/core/databases"
import { MongoDatabase } from "../../ker/core/databases/mongo"

export class GDoc {
    private targetDatabase: IMongoDatabase
    private alias: string
    private data: IGDoc
    private customDB: string | undefined
    private storage: {
        schemas: { [k: string]: any }
    }

    constructor(alias: string, storage: {
        schemas: { [k: string]: any }
    }) {
        this.alias = alias
        this.storage = storage

        const d = _dcs.find((dc: IGDoc) => dc.metadata.alias === this.alias)
        if (!d) throw 'err'
        this.data = d

        // if (!this.storage.schemas[this.alias]) {
        // transforms the fields object into useful structure
        const o: any = {}
        typeDefiner(this.data.fields, o);

        this.storage.schemas[this.alias] = o
        // }

        this.targetDatabase = getDatabaseByName(d.database.db) as IMongoDatabase
        this.customDB = d.database.customDB
        // this.db = new MongoDatabase(targetDatabase)
    }

    public async executeCreateDocument(values: Object = {}) {
        const objSchema = { ...this.storage.schemas[this.alias] }
        const r: any = {}
        valStructure(objSchema, values, r)

        const sch = { ...objSchema }
        schemaParser(sch)

        try {
            const db = new MongoDatabase(this.targetDatabase, this.customDB)
            await db.connect()
            const model = await db.createModelFromSchema(new mongoose.Schema(sch), this.data.database.dbCollection)
            const createDocumentRes = await db.createDocument(model, r);
            await db.close()

            return createDocumentRes
        } catch (ex) {
            throw ex
        }
    }

    public async executeReadDocument(queryName: string, criteria: Object = {}, limit: number = 0, raw: boolean = true) {
        const objSchema = this.storage.schemas[this.alias]
        const sch = objSchema
        schemaParser(sch)

        let cParsed: any = {}
        try {
            cParsed = criteriaConverter(this.data.queries.find(q => q.name === queryName)?.query || {}, criteria)

            const db = new MongoDatabase(this.targetDatabase, this.customDB)
            await db.connect()
            const model = await db.createModelFromSchema(new mongoose.Schema(sch), this.data.database.dbCollection)
            const readDocumentRes = await db.findDocument(model, limit, cParsed, raw);
            await db.close()

            return readDocumentRes
        } catch (ex) {
            throw ex
        }
    }

    public async executeUpdateDocument(queryName: string, criteria: any = {}, values: Object = {}) {
        const objSchema = { ...this.storage.schemas[this.alias] }
        const sch = { ...objSchema }
        schemaParser(sch)

        let cParsed: any = {}
        try {
            cParsed = criteriaConverter(this.data.queries.find(q => q.name === queryName)?.query || {}, criteria)

            const r: any = { $set: {}, $push: {} }
            valStructure(objSchema, values, r, '', true)

            const db = new MongoDatabase(this.targetDatabase, this.customDB)
            await db.connect()
            const model = await db.createModelFromSchema(new mongoose.Schema(sch), this.data.database.dbCollection)
            const readDocumentRes = await db.updateDocument(model, 1, cParsed, r);
            await db.close()

            return readDocumentRes
        } catch (ex) {
            throw ex
        }
    }
}