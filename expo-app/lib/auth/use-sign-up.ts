import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useState } from "react"

import { httpPost } from "../api"
import { Task, completedState, initialState } from "../task"
import { useAuthDispatch } from "./AuthContext"

export function useSignUp(): [Task, (email: string, password: string, name: string) => Promise<void>] {
  const [state, setState] = useState<Task>(initialState)

  const dispatch = useAuthDispatch()

  const fun = useCallback(async (email: string, password: string, name: string) => {
    setState({ ...initialState, isLoading: true })

    try {
      const { user, token } = await httpPost("register", { email, password, name })

      user.token = token

      await AsyncStorage.setItem("auth", JSON.stringify({ user }))

      dispatch({ type: "update", user })

      setState({ ...completedState, isSuccessful: true })
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [])

  return [state, fun]
}
