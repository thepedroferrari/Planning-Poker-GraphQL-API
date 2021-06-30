import type { Response } from "express"
import { authUser } from "../accounts/auth"
import { logUserIn } from "../accounts/logUserIn"
import { STATUS } from "../constants"
import { RegisterUser } from "../types"
import { findUserByEmail } from "../utils/findUserByEmail"
import { validateRegister } from "../utils/validateRegister"

export const authUserMutation = async (
  { email, password }: RegisterUser,
  res: Response,
) => {
  // Check for errors before doing unnecessary database requests
  if (!res) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors: [
          {
            field: "none",
            message: "CTX Not received.",
          },
        ],
      },
    }
  }

  if (!email && !password) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors: [
          {
            field: "email",
            message: "Email not provided.",
          },
          {
            field: "password",
            message: "Password not provided.",
          },
        ],
      },
    }
  }

  if (!email) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors: [
          {
            field: "email",
            message: "Email not provided.",
          },
        ],
      },
    }
  }

  if (!password) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors: [
          {
            field: "password",
            message: "Password not provided.",
          },
        ],
      },
    }
  }

  const errors = await validateRegister(
    {
      email: email.toLowerCase(),
      password,
    },
    "login",
  )

  if (errors.length > 0) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors,
      },
    }
  }

  try {
    const { isAuth, userId } = await authUser({
      email,
      password,
    })

    if (isAuth && userId) {
      await logUserIn({ userId, response: res })
      const user = await findUserByEmail(email)

      return {
        data: {
          status: STATUS.SUCCESS,
          errors: [],
          user: {
            email: user.email,
          },
        },
      }
    }

    return {
      data: {
        status: STATUS.FAILURE,
        errors: [
          {
            field: "Unknown",
            message: `isAuth is ${isAuth}`,
          },
        ],
      },
    }
  } catch (e) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors: [
          {
            field: e,
            message: res,
          },
        ],
      },
    }
  }
}
