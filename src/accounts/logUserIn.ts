import { LogUserIn } from "../types"
import { createSession } from "./createSession"
import { setAuthCookies } from "./setAuthCookies"
import { createTokens } from "./tokens"

export const logUserIn = async ({ userId, response }: LogUserIn) => {
  // Create Session
  const sessionToken = await createSession({ userId })

  // Create JWT
  const { accessToken, refreshToken } = await createTokens(sessionToken, userId)

  // Set Cookie
  setAuthCookies({ response, accessToken, refreshToken })
}
