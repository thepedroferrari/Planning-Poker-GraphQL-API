import { GraphQLServer } from "graphql-yoga"
import { findRoomByName } from "../utils/findRoomByName"
import {
  CreateRoom,
  Message,
  PushSubscriber,
  RegisterUser,
  Room,
  PostTopic,
} from "../types"
import { postMessage } from "./postMessage"
import { roomSubscription } from "./roomSubscription"
import { registerUserMutation } from "./registerUserMutation"
import { createRoomMutation } from "./createRoomMutation"
import { authUserMutation } from "./authUserMutation"
import { testAuth } from "./testAuth"
import { logoutQuery } from "./logoutQuery"
import { postTopic } from "./postTopic"
import { allRoomsSubscription } from "./allRoomsSubscription"
import { allRoomsQuery } from "./allRoomsQuery"
import { getMessagesFromRoomQuery } from "./getMessagesQuery"

const EVENT_UPDATE = "EVENT_UPDATE"
const ALL_ROOMS = "ALL_ROOMS"

const subscribers: PushSubscriber[] = []
const onMessagesUpdates = (fn: PushSubscriber) => subscribers.push(fn)

export const resolvers = {
  Query: {
    messages: async (_: unknown, ctx: { name: string }) =>
      await getMessagesFromRoomQuery(ctx.name),
    allRooms: async () => await allRoomsQuery(),
    logout: async (
      _: unknown,
      __: null,
      { req, res }: GraphQLServer["context"],
    ) => await logoutQuery(req, res),
    room: async (_: unknown, { name }: { name: string }) =>
      await findRoomByName(name),
  },
  Mutation: {
    authUser: async (
      _: unknown,
      args: RegisterUser,
      { res }: GraphQLServer["context"],
    ) => await authUserMutation(args, res),

    testAuth: async (
      _: unknown,
      __: null,
      { req, res }: GraphQLServer["context"],
    ) => await testAuth(req, res),

    postMessage: async (
      _: unknown,
      args: Omit<Message, "date" | "id">,
      ctx: GraphQLServer["context"],
    ) => postMessage(args, subscribers, EVENT_UPDATE, ctx),

    postTopic: async (
      _: unknown,
      args: PostTopic,
      ctx: GraphQLServer["context"],
    ) => postTopic(args, subscribers, EVENT_UPDATE, ctx),

    registerUser: async (
      _: unknown,
      { email, password }: RegisterUser,
      { res }: GraphQLServer["context"],
    ) => registerUserMutation(email, password, res),

    createRoom: async (
      _: unknown,
      args: CreateRoom,
      ctx: GraphQLServer["context"],
    ) => createRoomMutation(args, subscribers, ALL_ROOMS, ctx),
  },
  Subscription: {
    room: {
      subscribe: async (
        _parent: unknown,
        args: Pick<Room, "name">,
        ctx: GraphQLServer["context"],
      ) =>
        roomSubscription({
          onMessagesUpdates,
          ctx,
          args,
          channel: EVENT_UPDATE,
        }),
    },
    allRooms: {
      subscribe: async (
        _parent: unknown,
        _args: null,
        ctx: GraphQLServer["context"],
      ) =>
        allRoomsSubscription({
          onMessagesUpdates,
          ctx,
          channel: ALL_ROOMS,
        }),
    },

    // messages: {
    //   subscribe: (
    //     _parent: unknown,
    //     _args: unknown,
    //     { pubsub }: GraphQLServer["context"],
    //   ) => {
    //     const channel = Math.random().toString(36).slice(2, 15)
    //     onMessagesUpdates(() => pubsub.publish(channel, { messages }))
    //     setTimeout(() => pubsub.publish(channel, { messages }), 0)

    //     return pubsub.asyncIterator(channel)
    //   },
    // },
  },
}
