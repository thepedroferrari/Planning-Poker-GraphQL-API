import { logUserIn } from "../accounts/logUserIn"
import { registerUser } from "../accounts/registerUser"
import { STATUS } from "../constants"
import { validateRegister } from "../utils/validateRegister"
import type { Response } from "express"

export const registerUserMutation = async (
  email: string,
  password: string,
  response: Response,
) => {
  try {
    const errors = await validateRegister({ email, password })

    if (errors.length > 0) {
      return {
        data: {
          status: STATUS.FAILURE,
          errors,
        },
      }
    }

    const userId = await registerUser({
      email,
      password,
    })

    if (userId) {
      // Send cookies
      await logUserIn({ response, userId: userId.insertedId })

      return {
        data: {
          status: STATUS.SUCCESS,
          user: {
            id: userId,
            email: {
              address: email,
            },
          },
        },
      }
    }
    return {
      data: {
        status: STATUS.FAILURE,
      },
    }
  } catch (e) {
    return {
      data: {
        status: STATUS.FAILURE,
        error: e,
      },
    }
  }
}
