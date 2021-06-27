import type { Request, Response } from "express"
import { getUserFromCookies } from "../accounts/getUserFromCookies"
import { STATUS } from "../constants"

export const testAuth = async (request: Request, response: Response) => {
  try {
    // Verify User login
    const user = await getUserFromCookies(request, response)
    // Return user email if found, otherwise return false

    return user?._id
      ? {
          data: {
            status: STATUS.SUCCESS,
            user,
          },
        }
      : {
          data: {
            status: STATUS.FAILURE,
            error: {
              message: "User not found",
            },
          },
        }
  } catch (e) {
    console.error(`Error verifying from cookies: ${e}`)
    throw new Error(`Error verifying from cookies: ${e}`)
  }
}
