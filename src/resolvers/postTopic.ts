import { GraphQLServer } from "graphql-yoga"
import { PostTopic, PushSubscriber, Room, Topic } from "../types"
import { findRoomByName } from "../utils/findRoomByName"
import { updateRoom } from "../utils/updateRoom"

export const postTopic = async (
  { topicName, roomName, author }: PostTopic,
  subscribers: PushSubscriber[],
  channel: string,
  ctx: GraphQLServer["context"],
) => {
  try {
    const currentRoom = await findRoomByName(roomName)

    if (currentRoom === null) {
      return `Room with the name of ${roomName} does not exist in the database.`
    }

    if (currentRoom.owner !== author) {
      return `You must be the room owner to set up topics.`
    }

    const { topics } = currentRoom

    const hasRoomTopic = topics.some((topic) => topic.name === topicName)
    if (hasRoomTopic) {
      return `Topic with the name of ${topicName} already exists in the room.`
    }
    const newTopic: Topic = {
      name: topicName,
      votes: [],
    }

    const newTopics: Topic[] = [...topics, newTopic]
    const newRoom: Room = {
      ...currentRoom,
      topics: newTopics,
      lastUpdate: Date.now(),
    }

    await updateRoom(currentRoom, newRoom)
    topics.push(newTopic)

    const id = newTopics.length + 1 + Date.now()
    subscribers.forEach((fn) => fn())

    const { pubsub } = ctx
    await pubsub.publish(channel, { room: currentRoom })

    return id
  } catch (e) {
    throw new Error(`Error updating Room: ${e}`)
  }
}
