import { client } from "../db"
import { MONGO_DB_NAME } from "../env"

export const session = client.db(MONGO_DB_NAME).collection("session")

// index the session token since we're querying by it
session.createIndex({ sessionToken: 1 })
