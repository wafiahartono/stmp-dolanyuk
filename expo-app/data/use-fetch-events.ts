import { useCallback, useState } from "react"

import { get } from "../lib/api"
import { useAuth } from "../lib/auth"
import { Task, completedState, initialState } from "../lib/task"
import { Event } from "./Event"
import { useEventDispatch } from "./EventContext"

export function useFetchEvents(): [() => Promise<void>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const dispatch = useEventDispatch()

  const fun = useCallback(async () => {
    setState({ ...initialState, isLoading: true })

    try {
      const data: any[] = await get("events", {}, user!.token)

      const events: Event[] = data.map(item =>
        ({ ...item, datetime: new Date(item.datetime) })
      )

      dispatch({ type: "refresh", payload: events })

      setState({ ...completedState, isSuccessful: true })
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
