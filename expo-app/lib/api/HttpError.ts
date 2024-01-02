export class HttpError extends Error {
  constructor(status: number) {
    super(`Response returned with non-OK status: ${status}`)
  }
}
