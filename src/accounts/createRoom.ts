import { InsertOneWriteOpResult } from "mongodb"
import { CreateRoom, Room } from "../types"

export const createRoom = async ({ name, owner }: CreateRoom) => {
  try {
    // store in DB
    const { room } = await import("../models/room")

    const result: InsertOneWriteOpResult<Room> = await room.insertOne({
      name,
      owner,
      messages: [],
      topics: [],
      lastUpdate: Date.now(),
    })

    // Return room from Database
    return result
  } catch (e) {
    throw new Error(`Error creating Room: ${e}`)
  }
}
