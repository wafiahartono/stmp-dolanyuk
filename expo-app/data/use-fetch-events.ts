import { useCallback, useState } from "react"

import { httpGet } from "../lib/api/http-get"
import { useAuth } from "../lib/auth/AuthContext"
import { Task } from "../lib/task/Task"
import { completedState, initialState } from "../lib/task/state"
import { Event } from "./Event"
import { useEventDispatch } from "./EventContext"

export function useFetchEvents(): [() => Promise<Event[]>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const dispatch = useEventDispatch()

  const fun = useCallback(async () => {
    setState({ ...initialState, isLoading: true })

    try {
      const events: Event[] = (await httpGet("events", {}, user!.token) as any[])
        .map(item =>
          ({ ...item, datetime: new Date(item.datetime) })
        )

      dispatch({ type: "refresh", payload: events })

      setState({ ...completedState, isSuccessful: true })

      return events
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
