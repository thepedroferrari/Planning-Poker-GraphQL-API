import { GraphQLServer } from "graphql-yoga"
import { findUserByEmail } from "../utils/findUserByEmail"
import { authUser } from "../accounts/auth"
import { logUserIn } from "../accounts/logUserIn"
import { STATUS } from "../constants"
import { RegisterUser } from "../types"
import { validateRegister } from "../utils/validateRegister"

export const authUserMutation = async (
  { email, password }: RegisterUser,
  ctx: GraphQLServer["context"],
) => {
  // Check for errors before doing unnecessary database requests

  if (!email || !password) {
    return {
      data: {
        status: STATUS.FAILURE,
        errors: "We need email and password.",
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
      await logUserIn({ userId, response: ctx.res })
      const user = await findUserByEmail(email)

      return {
        data: {
          status: STATUS.SUCCESS,
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
        errors: {
          field: e,
          message: ctx.res,
        },
      },
    }
  }
}
