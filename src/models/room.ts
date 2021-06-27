import { client } from "../db"
import { MONGO_DB_NAME } from "../env"

export const room = client.db(MONGO_DB_NAME).collection("room")

// Index by the room name since it is the key we use to get the room.
room.createIndex({ name: 1 })
