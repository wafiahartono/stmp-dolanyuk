import { useCallback, useState } from "react"

import { httpGet } from "../lib/api"
import { useAuth } from "../lib/auth"
import { Task, completedState, initialState } from "../lib/task"
import { Player } from "./Player"

export function useFetchPlayers(): [(eventId: number) => Promise<Player[]>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const fun = useCallback(async (eventId: number) => {
    setState({ ...initialState, isLoading: true })

    try {
      const data: Player[] = await httpGet("participants", { event: eventId }, user!.token)

      setState({ ...completedState, isSuccessful: true })

      return data
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
