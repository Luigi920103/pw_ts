import { test, expect } from "../../fixtures/fixture.js"
import {
  checkSchema,
  checkMinimumTime,
} from "../../resources/utils/commands.js"
import GetBookingServiceAction from "../../resources/services/getBooking.js"

let response
test.describe("Get booking by id", () => {
  test(
    "Test get booking by id",
    { tag: ["@debug", "@api", "@critical", "@OnlyThis", "@all"] },
    async ({ api, request }) => {
      response = await GetBookingServiceAction.getBookingById(request, 6)
      expect(Number(response.status)).toBe(200)
      const expectedTime = 1000
      const currentTime = Number(response.responseTimeMs)
      checkMinimumTime(expectedTime, currentTime)
      expect(response.body.firstname).toBe("Mark")
    },
  )
})
