import { registerUser } from "../accounts/registerUser"
import { STATUS } from "../constants"
import { validateRegister } from "../utils/validateRegister"

export const registerUserMutation = async (email: string, password: string) => {
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
      // await logUserIn({ response, request, userId })
      return {
        data: {
          status: STATUS.SUCCESS,
          userId,
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
