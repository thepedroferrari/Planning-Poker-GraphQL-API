import argon2 from "argon2"
import { InsertOneWriteOpResult } from "mongodb"
import { RegisterUser, User } from "../types"
import { argon2HashOptions } from "./argon2HashOptions"

export const registerUser = async ({ email, password }: RegisterUser) => {
  try {
    // Hash password
    const hashedPassword = await argon2.hash(password, argon2HashOptions)
    // store in DB

    const { user } = await import("../models/user")
    const result: InsertOneWriteOpResult<User & { _id: string }> = await user.insertOne({
      email: {
        address: email,
        verified: false,
      },
      password: hashedPassword,
      registrationDate: Date.now(),
    })

    // Return user from Database

    return result
  } catch (e) {
    throw new Error(`Error creating user: ${e}`)
  }
}
