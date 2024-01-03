import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useState } from "react"

import { post } from "../api"
import { Task, completedState, initialState } from "../task"
import { useAuthDispatch } from "./AuthContext"

export function useSignIn(): [Task, (email: string, password: string) => Promise<void>] {
  const [state, setState] = useState<Task>(initialState)

  const dispatch = useAuthDispatch()

  const fun = useCallback(async (email: string, password: string) => {
    setState({ ...initialState, isLoading: true })

    try {
      const { user, token } = await post("auth", { email, password })

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