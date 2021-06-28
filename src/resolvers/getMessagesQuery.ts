import { findRoomByName } from "../utils/findRoomByName"

export const getMessagesFromRoomQuery = async (name: string) => {
  const roomData = await findRoomByName(name)

  const { messages } = roomData

  return messages
}
