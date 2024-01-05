import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useState } from "react"

import { httpPost } from "../api/http-post"
import { Task } from "../task/Task"
import { completedState, initialState } from "../task/state"
import { useAuthDispatch } from "./AuthContext"

export type UpdateProfileParams = {
  current_password?: string
  new_password?: string
  name?: string
}

export function useUpdateProfile(): [Task, (params: UpdateProfileParams) => Promise<void>] {
  const [state, setState] = useState<Task>(initialState)

  const dispatch = useAuthDispatch()

  const fun = useCallback(async (params: UpdateProfileParams) => {
    setState({ ...initialState, isLoading: true })

    try {
      const { user, token } = await httpPost("users", params)

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
