import { randomBytes } from "crypto"
import { Session } from "../types"

type CreateSession = {
  userId: string
}

export const createSession = async ({ userId }: CreateSession) => {
  try {
    // Make a JWT Session token
    const token = randomBytes(12).toString("hex")
    const now = Date.now().toString(16)
    const sessionToken = token + now

    // insert session on DB
    const { session } = await import("../models/session")
    const newDate = new Date()

    const newSession: Session = {
      sessionToken,
      userId,
      valid: true,
      updatedAt: newDate,
      createdAt: newDate,
    }

    await session.insertOne(newSession)

    return sessionToken
  } catch (e) {
    throw new Error(`Error at creating session. ${e}`)
  }

  // return session token
}
