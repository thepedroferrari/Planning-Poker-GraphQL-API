import { ROOT_DOMAIN } from "../env"
import type { Response } from "express"

type SetCookies = {
  response: Response
  refreshToken: string
  accessToken: string
}

export const setAuthCookies = ({ response, refreshToken, accessToken }: SetCookies) => {
  const now = new Date()
  const refreshExpires = new Date(now.setDate(now.getDate() + 30))

  // Send cookies back to Frontend
  try {
    response.cookie("refreshToken", refreshToken, {
      path: "/",
      domain: ROOT_DOMAIN,
      httpOnly: true,
      expires: refreshExpires,
    })

    response.cookie("accessToken", accessToken, {
      path: "/",
      domain: ROOT_DOMAIN,
      httpOnly: true,
    })
  } catch (error) {
    console.error("Error setting up cookies", error)
    throw new Error(error)
  }
}
