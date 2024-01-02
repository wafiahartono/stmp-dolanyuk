type ErrorBag = { [key: string]: string }

export class ValidationError extends Error {
  public errors: ErrorBag

  constructor(errors: ErrorBag) {
    super("Data validation error from server")

    this.errors = errors
  }
}
