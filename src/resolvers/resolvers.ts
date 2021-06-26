import { GraphQLServer } from "graphql-yoga"
import { Message, PushSubscriber } from "src/types"

const messages: Message[] = [
  {
    id: 1,
    author: "Pedro Ferrari",
    date: Date.now(),
    content: "Hello!",
    vote: "2",
  },
  {
    id: 2,
    author: "Hubert J. Farnsworth",
    date: Date.now() + 5000,
    content: "Good news everyone!",
    vote: "5",
  },
  {
    id: 3,
    author: "Bender Bending Rodriguez",
    date: Date.now() + 10000,
    content: "I'm So Embarrassed. I Wish Everybody Else Was Dead.",
    vote: "1",
  },
  {
    id: 4,
    author: "Philip J. Fry",
    date: Date.now() + 12000,
    content: "Valentine's Day Is Coming? Oh Crap - I Forgot To Get A Girlfriend Again.",
    vote: "0.5",
  },
  {
    id: 5,
    author: "John A. Zoidberg",
    date: Date.now() + 22000,
    content: "Fry, It's Been Years Since Medical School, So Remind Me. Disemboweling In Your Species: Fatal Or Non-Fatal?",
    vote: "7",
  },
  {
    id: 6,
    author: "Turanga Leela",
    date: Date.now() + 300000,
    content: "Well, You Obviously Won't Listen To Reason. So, I Guess I'll Listen To Idiotic-Ness And Come With You.",
    vote: "1",
  },
  {
    id: 7,
    author: "Hubert J. Farnsworth",
    date: Date.now() + 360000,
    content: "Now, Now. There Will Be Plenty Of Time To Discuss Your Objections When And If You Return.",
    vote: "5",
  },
  {
    id: 8,
    author: "Amy Wong",
    date: Date.now() + 400000,
    content: "Finally, A Uniform I'd Be Happy To Be Caught Dead In!",
    vote: "2",
  },
  {
    id: 9,
    author: "Hermes Conrad",
    date: Date.now() + 500000,
    content: "If You Ask Me, It's Mighty Suspicious. I'm Gonna Call The Police. Right After I Flush Some Things.",
    vote: "2",
  },
  {
    id: 11,
    author: "Pedro Ferrari",
    date: Date.now(),
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tellus dui, eleifend nec lectus vitae, luctus dapibus mi. Maecenas gravida feugiat ante, id efficitur eros ultricies tincidunt. In bibendum at mauris eget accumsan. Duis malesuada mi vitae ipsum egestas feugiat.",
    vote: "2",
  },
  {
    id: 12,
    author: "Zap Brannigan",
    date: Date.now() + 700000,
    content: "I Got Your Distress Call And Came Here As Soon As I Wanted To.",
    vote: "2",
  },
  {
    id: 13,
    author: "Philip J. Fry",
    date: Date.now() + 950000,
    content: "Did Everything Just Taste Purple For A Second?",
    vote: "0.5",
  },
  {
    id: 14,
    author: "Bender Bending Rodriguez",
    date: Date.now() + 1000000,
    content: "My Story Is A Lot Like Yours, Only More Interesting 'Cause It Involves Robots.",
    vote: "1",
  },
]

const subscribers: PushSubscriber[] = []
const onMessagesUpdates = (fn: PushSubscriber) => subscribers.push(fn)

export const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (_: unknown, { author, content, vote = "" }: Message) => {
      const id = messages[messages.length - 1].id + 1
      messages.push({
        id,
        author,
        content,
        vote,
        date: Date.now(),
      })
      subscribers.forEach((fn) => fn())
      return id
    },
  },
  Subscription: {
    messages: {
      subscribe: (_parent: unknown, _args: unknown, { pubsub }: GraphQLServer["context"]) => {
        const channel = Math.random().toString(36).slice(2, 15)
        onMessagesUpdates(() => pubsub.publish(channel, { messages }))
        setTimeout(() => pubsub.publish(channel, { messages }), 0)

        return pubsub.asyncIterator(channel)
      },
    },
  },
}
