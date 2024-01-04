import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback } from "react"

import { useEventDispatch } from "../../data"
import { useAuthDispatch } from "./AuthContext"

export function useSignOut(): () => Promise<void> {
  const dispatch = useAuthDispatch()

  const eventDispatch = useEventDispatch()

  return useCallback(async () => {
    await AsyncStorage.removeItem("auth")

    dispatch({ type: "clear", user: null })

    eventDispatch({ type: "refresh", payload: [] })
  }, [])
}
