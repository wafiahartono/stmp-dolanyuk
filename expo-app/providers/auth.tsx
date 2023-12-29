import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import useApi from "../hooks/api"
import { Task } from "../types/Task"
import { Unit } from "../types/Unit"
import { Credentials, SignUpData, User } from "../types/dtos"

type SignInHook = [
  (credentials: Credentials) => void,
  Task<Unit> | undefined,
]

type SignUpHook = [
  (data: SignUpData) => void,
  Task<Unit> | undefined,
]

export interface AuthContext {
  user?: User | null
  token?: string | null
  useSignIn(): SignInHook
  useSignUp(): SignUpHook
  logout(): void
}

const AuthContext = createContext<AuthContext | null>(null) as React.Context<AuthContext>

export function useAuth() {
  return useContext(AuthContext)
}

type Props = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>()
  const [token, setToken] = useState<string | null>()

  const api = useApi()

  useEffect(() => {
    AsyncStorage.getItem("auth").then(string => {
      const { user, token } = JSON.parse(string ?? "{}")

      setUser(user ?? null)
      setToken(token ?? null)
    })
  }, [])

  useEffect(() => {
    if (token === undefined) return

    api.setToken(token)
  }, [token])

  const useSignIn = useCallback((): SignInHook => {
    const [state, setState] = useState<Task<Unit>>()

    const fun = useCallback((credentials: Credentials) => {
      setState("Loading")

      const execute = async () => {
        try {
          const { user, token } = await api.signIn(credentials)

          await AsyncStorage.setItem("auth", JSON.stringify({ user, token }))

          setUser(user)
          setToken(token)

          setState("Unit")
        } catch (e: any) {
          setState(e)
        }
      }
      execute()
    }, [])

    return [fun, state]
  }, [])

  const useSignUp = useCallback((): SignUpHook => {
    const [state, setState] = useState<Task<Unit>>()

    const fun = useCallback((data: SignUpData) => {
      setState("Loading")

      const execute = async () => {
        try {
          const { user, token } = await api.signUp(data)

          await AsyncStorage.setItem("auth", JSON.stringify({ user, token }))

          setUser(user)
          setToken(token)

          setState("Unit")
        } catch (e: any) {
          setState(e)
        }
      }
      execute()
    }, [])

    return [fun, state]
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)

    AsyncStorage.removeItem("auth")
  }, [])

  const contextValue = useMemo((): AuthContext => ({
    user,
    token,
    useSignIn,
    useSignUp,
    logout,
  }), [user, token])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
