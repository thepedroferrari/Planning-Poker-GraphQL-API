import { InsertOneWriteOpResult } from "mongodb"
import { ROOT_DOMAIN } from "../env"
import { CreateRoom, Room } from "../types"

export const createRoom = async ({ name, owner }: CreateRoom) => {
  try {
    // store in DB
    const { room } = await import("../models/room")
    const URIEncodedName = encodeURIComponent(name)

    const url = `https://${ROOT_DOMAIN}/room/${URIEncodedName}`

    const result: InsertOneWriteOpResult<Room> = await room.insertOne({
      name,
      owner,
      messages: [],
      url,
    })

    // Return room from Database
    return result
  } catch (e) {
    throw new Error(`Error creating Room: ${e}`)
  }
}
