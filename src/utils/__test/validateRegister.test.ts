import { validateRegister } from "../validateRegister"
import { connectDb } from "../../db"

describe("Validating Registry Info", () => {
  test("It should be a valid registration", async () => {
    connectDb().then(async () => {
      const email = "john@smith.com"
      // const username = "john"
      const password = "strong123"
      const registryErrors = await validateRegister({ email, password })

      expect(registryErrors.length).toBe(0)
    })
  })
})
