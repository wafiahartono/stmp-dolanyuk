type ErrorBag = { [key: string]: string }

export class HttpError extends Error {
  constructor(status: number) {
    super(`Response returned with non-OK status (${status})`)
  }
}

export class ValidationError extends Error {
  public errors: ErrorBag

  constructor(errors: ErrorBag) {
    super("Data validation error.")

    this.errors = errors
  }
}

export class InvalidUserError extends Error { }
