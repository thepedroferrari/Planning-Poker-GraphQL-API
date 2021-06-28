import type { Response } from "express"
import { setAuthCookies } from "./setAuthCookies"
import { createTokens } from "./tokens"

type RefreshTokens = {
  sessionToken: string
  response: Response
  userId: string
}

export const refreshTokens = async ({
  sessionToken,
  response,
  userId,
}: RefreshTokens) => {
  try {
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId,
    )
    setAuthCookies({ response, accessToken, refreshToken })
  } catch (e) {
    throw new Error(`Error getting user from cookies: ${e}`)
  }
}
