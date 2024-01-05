import { useCallback, useState } from "react"

import { httpPost } from "../lib/api"
import { useAuth } from "../lib/auth"
import { Task, completedState, initialState } from "../lib/task"
import { Event } from "./Event"
import { useEventDispatch } from "./EventContext"

export function useJoinEvent(): [(event: Event) => Promise<void>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const dispatch = useEventDispatch()

  const fun = useCallback(async (event: Event) => {
    setState({ ...initialState, isLoading: true })

    try {
      await httpPost("participants", { event: event.id }, user!.token)

      dispatch({
        type: "update",
        payload: {
          ...event,
          participant: true,
          participants: event.participants + 1,
        },
      })

      setState({ ...completedState, isSuccessful: true })
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
