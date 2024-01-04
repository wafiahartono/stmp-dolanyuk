import configs from "./configs"
import {
  HttpError,
  InvalidUserError,
  ValidationError,
  buildFormData,
} from "./index"

export async function httpPost(path: string, data: object, token?: string) {
  const response = await fetch(`${configs.apiUrl}/${path}.php`, {
    method: "post",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: buildFormData(data),
  })

  const body = await response.text()

  const json = JSON.parse(body.length === 0 ? "{}" : body)

  if (response.status === 401)
    throw new InvalidUserError()

  if (response.status === 422)
    throw new ValidationError({ ...json.errors })

  if (!response.ok)
    throw new HttpError(response.status)

  return await json
}
