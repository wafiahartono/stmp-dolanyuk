import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

import { User } from "../types/dtos"
import { HttpError, InvalidUserError, ValidationError } from "../types/errors"
import { getFormData } from "../utils/request"

const baseUrl = "https://ubaya.me/react/160419098/dolanyuk"

type AuthState = {
  user?: User | null
  token?: string | null
}

type AuthContext = AuthState

const AuthContext = React.createContext<AuthContext | null>(null)

export function useAuth(): AuthContext {
  return React.useContext(AuthContext)!
}

const AuthDispatchContext = React.createContext<React.Dispatch<AuthDispatchAction> | null>(null)

function useAuthDispatch() {
  return React.useContext(AuthDispatchContext)!
}

type Props = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
  const [state, dispatch] = React.useReducer(authStateReducer, {})

  const { user, token } = state

  React.useEffect(() => {
    let ignore = false

    AsyncStorage.getItem("auth").then(string => {
      if (ignore) return

      const { user, token } = JSON.parse(string ?? "{}")

      dispatch({
        type: "update",
        user: user ?? null,
        token: token ?? null,
      })
    })

    return () => { ignore = true }
  }, [])

  const value = React.useMemo((): AuthContext => ({
    user,
    token,
  }), [user, token])

  return (
    <AuthContext.Provider value={value}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  )
}

type AuthDispatchUpdate = {
  type: "update"
  user: User
  token: string
}

type AuthDispatchClear = {
  type: "clear"
}

type AuthDispatchAction = AuthDispatchUpdate | AuthDispatchClear

function authStateReducer(state: AuthState, action: AuthDispatchAction): AuthState {
  switch (action.type) {
    case "update": {
      return {
        user: action.user,
        token: action.token,
      }
    }
    case "clear": {
      return {
        user: null,
        token: null,
      }
    }
    default: {
      throw new Error(`Unknown action: ${action}`)
    }
  }
}

type TaskState = {
  isLoading: boolean
  isComplete: boolean
  isSuccessful: boolean
  error?: Error
}

const initialState: TaskState = {
  isLoading: false,
  isComplete: false,
  isSuccessful: false,
  error: undefined,
}

const completedState: Pick<TaskState, "isLoading" | "isComplete"> = {
  isLoading: false,
  isComplete: true,
}

export function useSignUp(): [TaskState, (email: string, password: string, name: string) => Promise<void>] {
  const [state, setState] = React.useState<TaskState>(initialState)

  const dispatch = useAuthDispatch()

  const execute = React.useCallback(async (email: string, password: string, name: string) => {
    setState({ ...initialState, isLoading: true })

    try {
      const response = await fetch(`${baseUrl}/register.php`, {
        method: "post",
        body: getFormData({ email, password, name }),
      })

      if (response.status === 422) throw new ValidationError({
        ...(await response.json()).errors
      })

      if (!response.ok) throw new HttpError(response.status)

      const { user, token } = await response.json()

      await AsyncStorage.setItem("auth", JSON.stringify({ user, token }))

      dispatch({ type: "update", user, token })

      setState({ ...completedState, isSuccessful: true })

    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

    }
  }, [])

  return [state, execute]
}

export function useSignIn(): [TaskState, (email: string, password: string) => Promise<void>] {
  const [state, setState] = React.useState<TaskState>(initialState)

  const dispatch = useAuthDispatch()

  const execute = React.useCallback(async (email: string, password: string) => {
    setState({ ...initialState, isLoading: true })

    try {
      const response = await fetch(`${baseUrl}/auth.php`, {
        method: "post",
        body: getFormData({ email, password }),
      })

      if (response.status === 401) throw new InvalidUserError()

      if (!response.ok) throw new HttpError(response.status)

      const { user, token } = await response.json()

      await AsyncStorage.setItem("auth", JSON.stringify({ user, token }))

      dispatch({ type: "update", user, token })

      setState({ ...completedState, isSuccessful: true })

    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

    }
  }, [])

  return [state, execute]
}

export function useSignOut(): () => void {
  const dispatch = useAuthDispatch()

  const execute = React.useCallback(() => {
    AsyncStorage.removeItem("auth").then(() => {
      dispatch({ type: "clear" })
    })
  }, [])

  return execute
}
