import argon2 from "argon2"
import { findUserByEmail } from "../utils/findUserByEmail"
import { UserAuth } from "../types"
import { argon2HashOptions } from "./argon2HashOptions"

export const authUser = async ({ email, password }: UserAuth) => {
  const userData = await findUserByEmail(email)

  if (!userData) {
    return { isAuth: false, userId: null }
  }

  const isAuth = await argon2.verify(
    userData.password,
    password,
    argon2HashOptions,
  )

  return { isAuth, userId: userData._id }
}
