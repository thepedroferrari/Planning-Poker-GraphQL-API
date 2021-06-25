import gql from "graphql-tag"

export const typeDefs = gql`
  type Message {
    id: ID!
    author: String!
    content: String
    date: Float!
    vote: String
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(author: String!, content: String!, vote: String): ID!
  }

  type Subscription {
    messages: [Message!]
  }
`
