import { User } from "../types"

export const findUserByEmail = async (email: string) => {
  const { user } = await import("../models/user")

  const foundUser = (await user.findOne({
    "email.address": email,
  })) as User

  return foundUser
}
