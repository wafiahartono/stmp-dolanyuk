import configs from "./configs"
import { HttpError, InvalidUserError, buildSearchParams } from "./index"

export async function httpDelete(path: string, params: object = {}, token?: string) {
  const response = await fetch(`${configs.apiUrl}/${path}.php?${buildSearchParams(params)}`, {
    method: "delete",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  if (response.status === 401)
    throw new InvalidUserError()

  if (!response.ok)
    throw new HttpError(response.status)
}
