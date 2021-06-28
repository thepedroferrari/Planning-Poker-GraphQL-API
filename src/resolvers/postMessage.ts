import { findRoomByName } from "../utils/findRoomByName"
import { updateRoom } from "../utils/updateRoom"
import { Message, PushSubscriber, Room } from "../types"
import { GraphQLServer } from "graphql-yoga"
import { randomBytes } from "crypto"

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
      // mutating the original thing, we should cloneDeep this
      const currentTopic = currentRoom.topics[currentRoom.topics.length - 1]
      const hasAuthorVoted = currentTopic.votes.find(
        (vote) => vote.author === author,
      )

      if (hasAuthorVoted) {
        currentTopic.votes.forEach((entry) => {
          if (entry.author === author) {
            entry.vote = vote
          }
        })
      } else {
        currentTopic.votes.push({
          author,
          vote,
        })
      }
    }

    const { messages } = currentRoom
    const newMessage: Message = {
      id: `${Date.now().toString()}_${randomBytes(2).toString("base64")}`,
      author,
      date: Date.now(),
      content,
      vote,
      roomName,
    }

    const newMessages: Message[] = [...messages, newMessage]
    const newRoom: Room = {
      ...currentRoom,
      messages: newMessages,
      lastUpdate: Date.now(),
    }

    await updateRoom(currentRoom, newRoom)

    const id = messages[messages.length - 1].id + 1
    messages.push(newMessage)
    subscribers.forEach((fn) => fn())

    const { pubsub } = ctx
    await pubsub.publish(channel, { room: currentRoom })

    return id
  } catch (e) {
    throw new Error(`Error updating Room: ${e}`)
  }
}
