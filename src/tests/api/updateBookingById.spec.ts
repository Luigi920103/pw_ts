import { test, expect } from "../../fixtures/fixture.ts"
import {
  checkSchema,
  checkMinimumTime,
  mockApiResponseUsingFile,
} from "../../resources/utils/commands.js"
import UpdateBookingServiceAction from "../../resources/services/updateBooking.js"
import ApiSessionManager from "../../resources/utils/apiSessionManager.js"

let response

const bookingTestData = [
  {
    case: "update price successfully",
    id: 6,
    data: { totalprice: 100 },
    expectedStatus: 200,
  },
  {
    case: "regular price update",
    id: 7,
    data: { totalprice: 500 },
    expectedStatus: 200,
  },
]

test.describe("Update booking by id testing", () => {
  test(
    "Test update booking by id API mocking",
    { tag: ["@debug", "@api", "@critical", "@OnlyThis", "@all"] },
    async ({ api, request }) => {
      await ApiSessionManager.getApiSession(request, "admin")
      await mockApiResponseUsingFile(request, ".*/booking/.*", "bookingError")
      response = await UpdateBookingServiceAction.updateBookingById(
        request,
        6,
        "admin",
        {
          totalprice: 100,
        },
      )
      expect(Number(response.status)).toBe(400)
    },
  )

  bookingTestData.forEach(({ case: testCase, id, data, expectedStatus }) => {
    test(
      `test update with data: case ${testCase}`,
      { tag: ["@api", "@OnlyThis", "@all"] },
      async ({ api, request }) => {
        await ApiSessionManager.getApiSession(request, "admin")
        response = await UpdateBookingServiceAction.updateBookingById(
          request,
          id,
          "admin",
          data,
        )
        expect(Number(response.status)).toBe(expectedStatus)
      },
    )
  })
})
