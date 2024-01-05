import { useCallback, useState } from "react"

import { httpPost } from "../lib/api"
import { useAuth } from "../lib/auth"
import { Task, completedState, initialState } from "../lib/task"
import { Event } from "./Event"
import { useEventDispatch } from "./EventContext"
import { Game } from "./Game"

type StoreEventParams = {
  title: string
  game: Game
  datetime: Date
  venue: string
  address: string
}

export function useStoreEvent(): [(params: StoreEventParams) => Promise<Event>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const dispatch = useEventDispatch()

  const fun = useCallback(async (params: StoreEventParams) => {
    setState({ ...initialState, isLoading: true })

    try {
      const body = {
        title: params.title,
        game: params.game.id,
        datetime: params.datetime.toUTCString(),
        location: `${params.venue};${params.address}`,
      }

      const event = await httpPost("events", body, user!.token)

      event.datetime = new Date(event.datetime)

      dispatch({ type: "add", payload: event })

      setState({ ...completedState, isSuccessful: true })

      return event
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
