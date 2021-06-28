import { GraphQLServer } from "graphql-yoga"
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

  const hasErrors = await validateRegister(
    {
      email: email.toLowerCase(),
      password,
    },
    "login",
  )

  if (hasErrors.length > 0) return hasErrors

  try {
    const { isAuth, userId } = await authUser({
      email,
      password,
    })

    if (isAuth && userId) {
      await logUserIn({ userId, response: ctx.res })
      return {
        data: {
          status: STATUS.SUCCESS,
          user: {
            id: userId,
          },
        },
      }
    }

    return isAuth
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
