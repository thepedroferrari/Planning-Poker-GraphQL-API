import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET, ROOT_DOMAIN } from "../env"

export const logUserOut = async (request: Request, response: Response) => {
  try {
    // Get refresh token
    if (request.cookies?.refreshToken) {
      const { refreshToken } = request.cookies

      // decode refresh token
      const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET)
      const sessionToken = (decodedRefreshToken as { sessionToken: string })
        .sessionToken

      const { session } = await import("../models/session")

      // Delete database record for session
      await session.deleteOne({
        sessionToken,
      })
    }
    // Remove cookies
    const cookieOptions: CookieSessionInterfaces.CookieSessionOptions = {
      domain: ROOT_DOMAIN,
      path: "/",
    }
    response
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("accessToken", cookieOptions)
  } catch (e) {
    throw new Error(`Error logging out: ${e}`)
  }
}
