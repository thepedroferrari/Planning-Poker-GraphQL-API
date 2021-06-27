import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../env"

export const createTokens = async (sessionToken: string, userId: string) => {
  try {
    // Create Refresh Token
    // Session Id
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWT_SECRET,
      {
        expiresIn: "30d",
      },
    )
    // Create Access Token
    // Session Id, User Id
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWT_SECRET,
      {
        expiresIn: "30min",
      },
    )
    // Return Refresh Token

    return { accessToken, refreshToken }
  } catch (e) {
    throw new Error(`Couldn't Generate signed JWT's. ${e}`)
  }
}
