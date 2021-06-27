import { Room } from "../types"

export const findRoomByName = async (name: string) => {
  const { room } = await import("../models/room")
  const foundRoom = (await room.findOne({ name })) as Room

  return foundRoom
}
