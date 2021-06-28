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

// const messages: Message[] = [
//   {
//     id: "1",
//     roomName: "Frontend",
//     author: "Pedro Ferrari",
//     date: Date.now(),
//     content: "Hello!",
//     vote: "2",
//   },
//   {
//     id: "2",
//     roomName: "Frontend",
//     author: "Hubert J. Farnsworth",
//     date: Date.now() + 5000,
//     content: "Good news everyone!",
//     vote: "5",
//   },
//   {
//     id: "3",
//     roomName: "Frontend",
//     author: "Bender Bending Rodriguez",
//     date: Date.now() + 10000,
//     content: "I'm So Embarrassed. I Wish Everybody Else Was Dead.",
//     vote: "1",
//   },
//   {
//     id: "4",
//     roomName: "Frontend",
//     author: "Philip J. Fry",
//     date: Date.now() + 12000,
//     content: "Valentine's Day Is Coming? Oh Crap - I Forgot To Get A Girlfriend Again.",
//     vote: "0.5",
//   },
//   {
//     id: "5",
//     roomName: "Frontend",
//     author: "John A. Zoidberg",
//     date: Date.now() + 22000,
//     content: "Fry, It's Been Years Since Medical School, So Remind Me. Disemboweling In Your Species: Fatal Or Non-Fatal?",
//     vote: "7",
//   },
//   {
//     id: "6",
//     roomName: "Frontend",
//     author: "Turanga Leela",
//     date: Date.now() + 300000,
//     content: "Well, You Obviously Won't Listen To Reason. So, I Guess I'll Listen To Idiotic-Ness And Come With You.",
//     vote: "1",
//   },
//   {
//     id: "7",
//     roomName: "Frontend",
//     author: "Hubert J. Farnsworth",
//     date: Date.now() + 360000,
//     content: "Now, Now. There Will Be Plenty Of Time To Discuss Your Objections When And If You Return.",
//     vote: "5",
//   },
//   {
//     id: "8",
//     roomName: "Frontend",
//     author: "Amy Wong",
//     date: Date.now() + 400000,
//     content: "Finally, A Uniform I'd Be Happy To Be Caught Dead In!",
//     vote: "2",
//   },
//   {
//     id: "9",
//     roomName: "Frontend",
//     author: "Hermes Conrad",
//     date: Date.now() + 500000,
//     content: "If You Ask Me, It's Mighty Suspicious. I'm Gonna Call The Police. Right After I Flush Some Things.",
//     vote: "2",
//   },
//   {
//     roomName: "Frontend",
//     id: "11",
//     author: "Pedro Ferrari",
//     date: Date.now(),
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tellus dui, eleifend nec lectus vitae, luctus dapibus mi. Maecenas gravida feugiat ante, id efficitur eros ultricies tincidunt. In bibendum at mauris eget accumsan. Duis malesuada mi vitae ipsum egestas feugiat.",
//     vote: "2",
//   },
//   {
//     roomName: "Frontend",
//     id: "12",
//     author: "Zap Brannigan",
//     date: Date.now() + 700000,
//     content: "I Got Your Distress Call And Came Here As Soon As I Wanted To.",
//     vote: "2",
//   },
//   {
//     roomName: "Frontend",
//     id: "13",
//     author: "Philip J. Fry",
//     date: Date.now() + 950000,
//     content: "Did Everything Just Taste Purple For A Second?",
//     vote: "0.5",
//   },
//   {
//     roomName: "Frontend",
//     id: "14",
//     author: "Bender Bending Rodriguez",
//     date: Date.now() + 1000000,
//     content:
//       "My Story Is A Lot Like Yours, Only More Interesting 'Cause It Involves Robots.",
//     vote: "1",
//   },
// ]

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
      ctx: GraphQLServer["context"],
    ) => await authUserMutation(args, ctx),

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

    registerUser: async (_: unknown, { email, password }: RegisterUser) =>
      registerUserMutation(email, password),

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
