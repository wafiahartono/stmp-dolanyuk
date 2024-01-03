import { useCallback, useState } from "react"

import { httpGet } from "../lib/api"
import { useAuth } from "../lib/auth"
import { Task, completedState, initialState } from "../lib/task"
import { Game } from "./Game"

export function useFetchGames(): [() => Promise<Game[]>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const fun = useCallback(async () => {
    setState({ ...initialState, isLoading: true })

    try {
      const data: Game[] = await httpGet("games", {}, user!.token)

      setState({ ...completedState, isSuccessful: true })

      return data
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
