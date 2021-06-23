export const typeDefs = `type Message {
  id: ID!
  author: String!
  content: String
  date: Int!
  vote: String
}

type Query {
  messages: [Message!]
}`
