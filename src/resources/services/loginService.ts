import { APIRequestContext, APIResponse } from "../../fixtures/fixture"
import ApiClient, { CustomAPIResponse } from "../utils/apiClient"
import { apiPaths } from "../utils/constants"
import { BaseService } from "./baseService"

const authPath: string = apiPaths.Login.auth

class LoginServiceAction extends BaseService {
  async apiLogin(
    request: APIRequestContext,
    user: string,
    password: string,
    config: object = {},
  ): Promise<CustomAPIResponse> {
    const payload = {
      username: user,
      password: password,
    }
    return await ApiClient.post(
      request,
      this.baseUrl,
      authPath,
      payload,
      config,
    )
  }
}

export default new LoginServiceAction()
