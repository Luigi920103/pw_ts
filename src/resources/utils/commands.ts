import dayjs from "dayjs"
import { expect, Page, APIRequestContext } from "../../fixtures/fixture"
import fs from "fs"
import * as baseSchema from "../../resources/schemas/indexSchema"
import MongoDBClient from "./mongoClient"
import PostgresClient from "./postgresClient"
import ApiClient, { CustomAPIResponse } from "../utils/apiClient"
import path from "path"

let sharedTestData: any
let currentRole: string
let mongoConnection: MongoDBClient
let pgConnection: PostgresClient
let mongoDocument: any
let postgresData: any
let dataSource: any
let apiLoginResponse: Record<string, any> = {}

const emailInput = '[type="email"] input'
const passwordInput = '[type="password"] input'
const loginButton = "div.form-group.w-100 > button"

export const setMongoDocument = (data: any): void => {
  mongoDocument = data
}
export const getMongoDocument = (): any => mongoDocument

export const setPostgresData = (data: any): void => {
  postgresData = data
}
export const getPostgresData = (): any => postgresData

export const shareData = (data: any): void => {
  sharedTestData = data
}
export const getSharedData = (): any => sharedTestData

export const setLoginApiResponse = (data: Record<string, any>): void => {
  apiLoginResponse = data
}
export const getLoginApiResponse = (): Record<string, any> => apiLoginResponse

export const setCurrentRole = (role: string): void => {
  currentRole = role
}
export const getCurrentRole = (): string => currentRole

export async function loadDataSource(fileName: string): Promise<void> {
  const filePath = `./src/resources/dataSource/${fileName}.json`
  const rawData = fs.readFileSync(filePath, "utf8")
  dataSource = JSON.parse(rawData)
}

export async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.fill(emailInput, username)
  await page.fill(passwordInput, password)
  await page.click(loginButton)
}

export function cleanVariables(): void {
  sharedTestData = ""
  apiLoginResponse = {}
  mongoDocument = ""
  postgresData = ""
}

export async function mongoConnect(
  connection: string,
  db: string,
): Promise<void> {
  mongoConnection = new MongoDBClient(connection, db)
  await mongoConnection.connect()
}

export const getMongoConnection = (): MongoDBClient => mongoConnection

export async function pgConnect(
  newHost: string,
  newPort: number,
  newDatabase: string,
  newUser: string,
  pass: string,
  maxNumberOfConnections: number = 10,
): Promise<void> {
  const config = {
    host: newHost,
    port: newPort,
    database: newDatabase,
    user: newUser,
    password: pass,
    max: maxNumberOfConnections,
  }
  pgConnection = new PostgresClient(config)
  await pgConnection.connect()
}

export const getPgConnection = (): PostgresClient => pgConnection

export function getDate(addDays: number, format: string): string {
  return dayjs().add(addDays, "day").format(format)
}

export function checkSchema(
  lastResponse: CustomAPIResponse,
  schemaName: string,
): void {
  const schemaValidator = (baseSchema as any)[schemaName]

  if (!schemaValidator) {
    throw new Error(`❌ Schema "${schemaName}" not found in baseSchema`)
  }

  const responseBody = lastResponse.body
  const { error } = schemaValidator.validate(responseBody, {
    abortEarly: false,
  })

  if (error) {
    throw new Error(
      `❌ Schema response is not valid:\n${JSON.stringify(error.details, null, 2)}`,
    )
  }
  console.log(`✅ Schema "${schemaName}" validated successfully`)
}

export function checkMinimumTime(
  minExpected: number,
  currentTime: number | string,
): void {
  typeof currentTime === "string" ? parseFloat(currentTime) : currentTime
  expect(
    currentTime,
    `❌ Response time ${currentTime}ms is greater than expected ${minExpected}ms`,
  ).toBeLessThan(minExpected)
}

export function mockApiResponseUsingFile(
  request: APIRequestContext,
  urlPattern: string | RegExp,
  fileName: string,
): void {
  const mockPath = path.resolve(`./src/resources/mocks/${fileName}.json`)

  if (!fs.existsSync(mockPath)) {
    throw new Error(`There is no file in the path: ${mockPath}`)
  }

  const mockData = JSON.parse(fs.readFileSync(mockPath, "utf-8"))

  ApiClient.setMock(request, urlPattern, {
    status: mockData.status || 200,
    headers: {
      ...mockData.headers,
      "Content-Type": mockData.contentType || "application/json",
    },
    body: mockData.body,
  })
  console.log(
    `✅ Mock activated "${urlPattern}" using the file "${fileName}.json"`,
  )
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`🗑️  File ${filePath} deleted.`)
    }
  } catch (error: any) {
    console.error(`⚠️  Error deleting file ${filePath}:`, error.message)
  }
}
