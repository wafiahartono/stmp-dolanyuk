type ErrorBag = { [key: string]: string }

export class ValidationError extends Error {
  public errors: ErrorBag

  constructor(errors: ErrorBag) {
    super("Data validation error.")

    this.errors = errors
  }
}

export class InvalidUserError extends Error { }
