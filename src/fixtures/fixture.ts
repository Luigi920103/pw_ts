import {
  test as base,
  expect,
  Page,
  Locator,
  APIRequestContext,
  APIResponse,
} from "@playwright/test"

import ApiClient from "../resources/utils/apiClient"
import { cleanVariables, deleteFile } from "../resources/utils/commands"
import path from "path"
import HomePage from "../pages/homePage"

const CACHE_FILE = path.resolve("./src/resources/temp/api_token_cache.json")
export type MyFixtures = {
  api: typeof ApiClient
  homePage: HomePage
}

export const test = base.extend<MyFixtures>({
  api: async ({ request }, use) => {
    ApiClient.clearMocks(request)
    cleanVariables()
    await use(ApiClient)

    ApiClient.clearMocks(request)
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
})

test.beforeAll(async () => {
  console.log("🧹  [Global Setup JS] deleting authentication cache file")
  await deleteFile(CACHE_FILE)
})

export { expect, Page, Locator, APIRequestContext, APIResponse }
