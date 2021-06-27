import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import mongodb from "mongodb"
import { JWT_SECRET } from "../env"
import { Session, User } from "../types"
import { refreshTokens } from "./refreshTokens"

const { ObjectId } = mongodb

export const getUserFromCookies = async (request: Request, response: Response) => {
  const { user } = await import("../models/user")

  console.log("REQUEST:", request.cookies)

  try {
    // token exists?
    if (request.cookies?.accessToken) {
      const { accessToken } = request.cookies
      // decode access token
      const decodedAccessToken = jwt.verify(accessToken, JWT_SECRET)

      console.log(decodedAccessToken)
      return user.findOne({
        _id: new ObjectId((decodedAccessToken as { userId: string })?.userId),
      })
    }

    if (request.cookies?.refreshToken) {
      const { refreshToken } = request.cookies
      // decode refresh token
      const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET)
      const sessionToken = (decodedRefreshToken as { sessionToken: string }).sessionToken

      const { session } = await import("../models/session")

      // look up session
      const currentSession = (await session.findOne({
        sessionToken,
      })) as Session | undefined

      if (currentSession?.valid) {
        // Look up current User
        const currentUser = (await user.findOne({
          _id: new ObjectId(currentSession.userId),
        })) as User

        // refresh tokens
        await refreshTokens({ sessionToken, response, userId: currentUser._id })

        // return current user
        return currentUser
      }
    }
  } catch (e) {
    throw new Error(`Error getting user from cookies: ${e}`)
  }
}
