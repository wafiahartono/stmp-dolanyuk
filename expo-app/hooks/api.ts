import { useCallback, useMemo, useState } from "react"

import { AuthResult, Credentials, SignUpData } from "../types/dtos"
import { InvalidUserError, ValidationError } from "../types/errors"
import getFormData from "../utils/get-form-data"

const config = {
  url: "https://ubaya.me/react/160419098/dolanyuk",

  headers: {
    "Accept": "application/json"
  },
}

export default function useApi() {
  const [token, setToken] = useState<string | null>(null)

  const signIn = useCallback(async (credentials: Credentials): Promise<AuthResult> => {
    const response = await fetch(`${config.url}/auth.php`, {
      method: "post",
      headers: config.headers,
      body: getFormData(credentials),
    })

    if (response.status === 401) throw new InvalidUserError()

    if (!response.ok) throw new Error(`Response returned with non-OK status (${response.status})`)

    return { ...await response.json() }
  }, [])

  const signUp = useCallback(async (data: SignUpData): Promise<AuthResult> => {
    const response = await fetch(`${config.url}/register.php`, {
      method: "post",
      headers: config.headers,
      body: getFormData(data),
    })

    if (response.status === 422) throw new ValidationError({
      ...(await response.json()).errors
    })

    if (!response.ok) throw new Error(`Response returned with non-OK status (${response.status})`)

    return { ...await response.json() }
  }, [])

  return useMemo(() => ({
    setToken,
    signIn,
    signUp,
  }), [])
}
