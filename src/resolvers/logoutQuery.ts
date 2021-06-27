import type { Request, Response } from "express"
import { logUserOut } from "../accounts/logUserOut"
import { STATUS } from "../constants"

export const logoutQuery = async (request: Request, response: Response) => {
  await logUserOut(request, response)

  return {
    data: {
      status: STATUS.SUCCESS,
      message: "User Logged out",
    },
  }
}
