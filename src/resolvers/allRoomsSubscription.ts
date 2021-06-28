import { GraphQLServer } from "graphql-yoga"
import { PushSubscriber } from "../types"

type RoomSubscription = {
  onMessagesUpdates: (fn: PushSubscriber) => number
  ctx: GraphQLServer["context"]
  channel: string
}

export const allRoomsSubscription = async ({
  onMessagesUpdates,
  ctx,
  channel,
}: RoomSubscription) => {
  const { pubsub } = ctx

  const { allRooms } = await import("../models/room")
  const rooms = await allRooms()

  console.log(rooms)

  onMessagesUpdates(
    async () => await pubsub.publish(channel, { allRooms: rooms }),
  )

  // we do this setTimeout so the first message gets sent as soon as you subscribe.
  setTimeout(async () => await pubsub.publish(channel, { allRooms: rooms }), 0)

  return await pubsub.asyncIterator(channel)
}
