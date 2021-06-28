import type { Request, Response } from "express"
import { getUserFromCookies } from "../accounts/getUserFromCookies"
import { STATUS } from "../constants"

export const testAccountRoute = async (
  request: Request,
  response: Response,
) => {
  try {
    // Verify User login
    const user = await getUserFromCookies(request, response)
    // Return user email if found, otherwise return false

    user?._id
      ? response.send({
          data: {
            status: STATUS.SUCCESS,
            user,
          },
        })
      : response.send({
          data: {
            status: STATUS.FAILURE,
            error: "User not found",
          },
        })
  } catch (e) {
    response.send({
      data: {
        status: STATUS.FAILURE,
        error: e,
      },
    })
    throw new Error(`Error verifying from cookies: ${e}`)
  }
}
