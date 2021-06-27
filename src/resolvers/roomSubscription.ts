import { GraphQLServer } from "graphql-yoga"
import { findRoomByName } from "../utils/findRoomByName"
import { PushSubscriber, Room } from "../types"

type RoomSubscription = {
  onMessagesUpdates: (fn: PushSubscriber) => number
  ctx: GraphQLServer["context"]
  args: Pick<Room, "name">
  channel: string
}

export const roomSubscription = async ({ onMessagesUpdates, ctx, args, channel }: RoomSubscription) => {
  const { name } = args
  const { pubsub } = ctx

  const currentRoom = await findRoomByName(name)

  onMessagesUpdates(() => pubsub.publish(channel, { room: currentRoom }))
  setTimeout(() => pubsub.publish(channel, { room: currentRoom }), 0)

  return pubsub.asyncIterator(channel)
}
