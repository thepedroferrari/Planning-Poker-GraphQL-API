import gql from "graphql-tag"

export const typeDefs = gql`
  type Message {
    id: ID!
    author: String!
    content: String
    date: Float!
    vote: Float
    roomName: String!
  }

  type Room {
    id: ID!
    name: String!
    owner: String!
    messages: [Message!]
  }

  type User {
    id: ID!
    email: String!
    password: String!
  }

  type Query {
    messages: [Message!]
    logout: ReturnMessageData
    room(name: String!): Room!
  }

  type Mutation {
    authUser(email: String!, password: String!): ReturnMessageData!
    testAuth: ReturnMessageData!
    postMessage(author: String!, content: String!, vote: String, roomName: String!): ID!
    registerUser(email: String!, password: String!): ReturnMessageData!
    createRoom(name: String!, owner: String!): ReturnMessageData!
  }

  type Subscription {
    messages: [Message!]
    room(name: String!): Room
  }

  type Error {
    field: String!
    message: String!
  }

  type ReturnMessage {
    status: String!
    message: String
    error: Error
    user: User
    room: Room
  }
  type ReturnMessageData {
    data: ReturnMessage
  }
`
