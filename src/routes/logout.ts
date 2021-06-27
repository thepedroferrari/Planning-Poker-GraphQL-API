import type { Request, Response } from "express"
import { logUserOut } from "../accounts/logUserOut"
import { STATUS } from "../constants"

export const logoutRoute = async (request: Request, response: Response) => {
  await logUserOut(request, response)

  response.send({
    data: {
      status: STATUS.SUCCESS,
      message: "User Logged out",
    },
  })
}
