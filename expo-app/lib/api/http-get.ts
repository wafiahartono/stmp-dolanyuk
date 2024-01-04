import configs from "./configs"
import { HttpError, InvalidUserError, buildSearchParams } from "./index"

export async function httpGet(path: string, params: object = {}, token?: string) {
  const response = await fetch(`${configs.apiUrl}/${path}.php?${buildSearchParams(params)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  const text = await response.text()

  const json = JSON.parse(text.length === 0 ? "{}" : text)

  if (response.status === 401)
    throw new InvalidUserError()

  if (!response.ok)
    throw new HttpError(response.status)

  return await json
}
