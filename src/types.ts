import type { Request, Response } from "express"
import { STATUS } from "./constants"

export type User = {
  email: {
    address: string
    verified: boolean
  }
  password: string
  registrationDate: number
  _id: string
}

export type UserAuth = {
  email: string
  password: string
}

export type RegisterUser = UserAuth

export type CreateRoom = {
  name: string
  owner: string // user email
}

export type Message = {
  id: string
  author: string
  content?: string
  date: number
  vote?: number
  roomName: string
}

export type Votes = {
  author: string
  vote: number
}

export type Topic = {
  name: string
  votes: Votes[]
}

export type Room = {
  _id: string
  name: string
  owner: string // user email
  messages: Message[]
  topics: Topic[]
  lastUpdate: number
}

export type SendMessage = Message & { roomName: string }

export type RoomParams = Pick<Room, "name">

export type LogUserIn = {
  userId: string
  response: Response
}

export type ConnectionInfo = {
  ip: string
  userAgent?: string
}

export type Session = {
  sessionToken: string
  userId: string
  valid: boolean
  updatedAt: Date
  createdAt: Date
}

export type PushSubscriber = () => void

export type RequestUserRoute = Request<{}, {}, UserAuth>

export type ReturnMessage = {
  status: STATUS
  error?: {
    field: string
    message: string
  }
  user?: User
}

export type PostTopic = {
  author: string
  topicName: string
  roomName: string
}
