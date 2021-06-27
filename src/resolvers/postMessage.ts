import { findRoomByName } from "../utils/findRoomByName"
import { updateRoom } from "../utils/updateRoom"
import { Message, PushSubscriber, Room } from "../types"
import { GraphQLServer } from "graphql-yoga"

export const postMessage = async (
  { author, content, vote, roomName }: Omit<Message, "date" | "id">,
  subscribers: PushSubscriber[],
  channel: string,
  ctx: GraphQLServer["context"],
) => {
  try {
    const currentRoom = await findRoomByName(roomName)

    if (currentRoom === null) {
      return `Room with the name of ${roomName} does not exist in the database.`
    }

    if (vote) {
      // We should update the vote instead of the message
    }

    const { messages } = currentRoom
    const newMessage: Message = {
      id: Date.now(),
      author,
      date: Date.now(),
      content,
      vote,
      roomName,
    }

    const newMessages: Message[] = [...messages, newMessage]
    const newRoom: Room = { ...currentRoom, messages: newMessages }

    await updateRoom(currentRoom, newRoom)

    const id = messages[messages.length - 1].id + 1
    messages.push(newMessage)
    subscribers.forEach((fn) => fn())

    const { pubsub } = ctx
    pubsub.publish(channel, { room: currentRoom })

    return id
  } catch (e) {
    throw new Error(`Error updating Room: ${e}`)
  }
}
