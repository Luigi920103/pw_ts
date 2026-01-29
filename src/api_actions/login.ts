import { APIRequestContext, APIResponse } from "@playwright/test"
import LoginServiceAction from "../resources/services/loginService"

export type UserRole = "admin" | "regular user"

class LoginActions {
  async apiLogin(
    request: APIRequestContext,
    role: UserRole,
  ): Promise<APIResponse | undefined> {
    let response: APIResponse | undefined | any

    switch (role.toLowerCase()) {
      case "admin":
        response = await LoginServiceAction.apiLogin(
          request,
          process.env.ADMIN_EMAIL!,
          process.env.ADMIN_PASSWORD!,
        )
        break

      case "regular user":
        response = await LoginServiceAction.apiLogin(
          request,
          process.env.REGULAR_USER_EMAIL!,
          process.env.REGULAR_USER_PASSWORD!,
        )
        break

      default:
        throw new Error(
          `This role "${role}" has not been configured on the automation framework`,
        )
    }

    return response
  }
}

export default new LoginActions()
