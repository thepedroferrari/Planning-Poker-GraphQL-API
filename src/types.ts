export type User = {
  username: string
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

export type RegisterUser = UserAuth & {
  username: string
}

export type CreateRoom = {
  name: string
  owner: string // user email
}

export type Message = {
  id: number
  author: string
  content?: string
  date: number
  vote?: string
}

export type Room = CreateRoom & {
  _id: string
  messages: Message[]
  uri: string
}

export type SendMessage = Message & { roomName: string }
export type RoomParams = Pick<Room, "name">

export type LogUserIn = {
  userId: string
  request: any // TODO: Fix
  reply: any // TODO: Fix
}

export type ConnectionInfo = {
  ip: string
  userAgent?: string
}

export type Session = {
  sessionToken: string
  userId: string
  valid: boolean
  ip: string
  userAgent: string | undefined
  updatedAt: Date
  createdAt: Date
}

export type PushSubscriber = () => void