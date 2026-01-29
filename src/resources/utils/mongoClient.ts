import {
  MongoClient,
  Db,
  Collection,
  Document,
  Filter,
  UpdateFilter,
  InsertOneResult,
  DeleteResult,
  UpdateResult,
} from "mongodb"
import { v5 as uuidv5 } from "uuid"

class MongoDBClient {
  private client: MongoClient
  private dbName: string
  private uri: string
  public db!: Db

  constructor(uri: string, dbName: string) {
    this.uri = uri
    this.dbName = dbName
    this.client = new MongoClient(this.uri)
  }

  async connect(): Promise<Db> {
    if (!this.db) {
      await this.client.connect()
      console.log("✅ Connected to MongoDB")
      this.db = this.client.db(this.dbName)
    } else {
      console.log("⚠️ MongoDB already connected")
    }
    return this.db
  }

  generateCustomUUID(collection: string, extraKey: string): string {
    const keyword = `${process.env.BASE_KEYWORD_ID}-${collection}-${extraKey}`
    const nameSpace = process.env.UUID_NAMESPACE

    if (!nameSpace) {
      throw new Error("UUID_NAMESPACE environment variable is not defined")
    }

    return uuidv5(keyword, nameSpace)
  }

  async insertOne<T extends Document>(
    collectionName: string,
    data: T,
  ): Promise<InsertOneResult<T>> {
    const collection = this.db.collection<T>(collectionName)
    return await collection.insertOne(data as any)
  }

  async countDocuments(
    collectionName: string,
    filter: Filter<Document> = {},
  ): Promise<number> {
    const collection = this.db.collection(collectionName)
    return await collection.countDocuments(filter)
  }

  async getDocumentsBy(
    collectionName: string,
    projection: Document = { _id: 1 },
  ): Promise<Document[]> {
    const collection = this.db.collection(collectionName)
    return await collection.find({}, { projection }).toArray()
  }

  async find<T extends Document>(
    collectionName: string,
    query: Filter<T> = {},
  ): Promise<T[]> {
    const collection = this.db.collection<T>(collectionName)
    return (await collection.find(query).toArray()) as T[]
  }

  async updateOne(
    collectionName: string,
    filter: Filter<Document>,
    update: Partial<Document>,
  ): Promise<UpdateResult> {
    const collection = this.db.collection(collectionName)
    return await collection.updateOne(filter, { $set: update })
  }

  async deleteOne(
    collectionName: string,
    filter: Filter<Document>,
  ): Promise<DeleteResult> {
    const collection = this.db.collection(collectionName)
    return await collection.deleteOne(filter)
  }

  async checkBeforeClone(
    collectionName: string,
    extraKey: string,
  ): Promise<string> {
    const id = this.generateCustomUUID(collectionName, extraKey)
    const query = { _id: id } as unknown as Filter<Document>
    const collection = this.db.collection(collectionName)

    const exists = await collection.findOne(query)
    return !exists ? "the UUID is unique on the collection" : id
  }

  async cloneAndModifyDocument<T extends Document>(
    collectionName: string,
    filter: Filter<T>,
    modifications: Partial<T>,
    extraKey: string = "",
  ): Promise<{ result: InsertOneResult<T>; newDoc: T }> {
    const collection = this.db.collection<T>(collectionName)
    const originalDoc = await collection.findOne(filter)

    if (!originalDoc) {
      throw new Error("Document not found")
    }

    const newDoc = {
      ...originalDoc,
      ...modifications,
      _id: this.generateCustomUUID(collectionName, extraKey),
      createdAt: new Date(),
    } as T

    const result = await collection.insertOne(newDoc as any)
    return { result, newDoc }
  }

  async close(): Promise<void> {
    await this.client.close()
    console.log("🔴 MongoDB connection closed")
  }

  generateAlphanumericId(length: number = 10): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

export default MongoDBClient
