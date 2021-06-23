import { Message } from "src/types"

const messages: Message[] = [
  {
    id: 1,
    author: "Pedro",
    date: Date.now(),
    content: "Hello",
    vote: "no",
  },
  {
    id: 2,
    author: "Pedro2",
    date: Date.now(),
    content: "Hello2",
    vote: "no2",
  },
]
export const resolvers = {
  Query: {
    messages: () => messages,
  },
}
