import { test, expect } from "../../fixtures/fixture" // Quitamos el .js
import { checkSchema, checkMinimumTime } from "../../resources/utils/commands"
import LoginAction from "../../api_actions/login"

let response: any

test.describe("Authentication testing", () => {
  test(
    "Test authentication API with valid admin credentials",
    { tag: ["@debug", "@api", "@critical", "@all"] },
    async ({ api, request }) => {
      response = await LoginAction.apiLogin(request, "admin")
      expect(Number(response.status)).toBe(200)
      checkSchema(response, "loginSchema")

      const expectedTime: number = 1000
      const currentTime: number = Number(response.responseTimeMs)

      checkMinimumTime(expectedTime, currentTime)
    },
  )
})
