import { client } from "../db"
import { MONGO_DB_NAME } from "../env"

export const user = client.db(MONGO_DB_NAME).collection("user")

// Index by the Email address since it is the key we use to get the user.
user.createIndex({ "email.address": 1 })
