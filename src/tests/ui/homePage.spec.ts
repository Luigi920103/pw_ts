import { test, expect } from "../../fixtures/fixture.js"
test.describe("basic HomePage testing", () => {
  test(
    "Basic test 1 for UI",
    { tag: ["@uiDebug", "@critical", "@all"] },
    async ({ homePage }) => {
      await homePage.navigate()
      await homePage.addFeaturedElement("MacBook")
      await expect(homePage.getSuccessAlertText()).resolves.toContain(
        "Success: You have added MacBook to your shopping cart!",
      )
    },
  )
  test(
    "test ui image comparison",
    { tag: ["@uiDebug", "@all"] },
    async ({ homePage }) => {
      await homePage.navigate()
      await expect(homePage.page).toHaveScreenshot("homePage.png", {
        fullPage: true,
        animations: "disabled",
      })
    },
  )
})
