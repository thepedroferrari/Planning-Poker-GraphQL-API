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
  type Votes {
    author: String!
    vote: String!
  }

  type Topic {
    name: String!
    votes: [Votes]!
  }

  type Room {
    id: ID!
    name: String!
    owner: String!
    messages: [Message!]
    topics: [Topic]
    lastUpdate: Float!
  }

  type Email {
    address: String!
    verified: Boolean
  }

  type User {
    id: ID!
    email: Email!
    password: String!
  }

  type Query {
    messages(name: String!): [Message!]
    logout: ReturnMessageData
    room(name: String!): Room!
    allRooms: [Room!]
  }

  type Mutation {
    authUser(email: String!, password: String!): UserAccountData!
    testAuth: ReturnMessageData!
    postMessage(
      author: String!
      content: String!
      vote: String
      roomName: String!
    ): ID!
    postTopic(topicName: String!, roomName: String!, author: String!): ID!

    registerUser(email: String!, password: String!): UserAccountData!
    createRoom(name: String!, owner: String!): ReturnMessageData!
  }

  type Subscription {
    # messages: [Message!]
    room(name: String!): Room
    allRooms: [Room]
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

  type UserAccount {
    status: String!
    errors: [Error]
    user: User
  }
  type UserAccountData {
    data: UserAccount
  }
`
