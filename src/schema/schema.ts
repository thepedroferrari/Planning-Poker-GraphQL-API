import gql from "graphql-tag"

export const typeDefs = gql`
  type Message {
    id: ID!
    author: String!
    content: String
    date: Int!
    vote: String
  }

  type Query {
    messages: [Message!]
  }
`
