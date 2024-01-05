import { useCallback, useState } from "react"

import { httpGet } from "../lib/api/http-get"
import { useAuth } from "../lib/auth/AuthContext"
import { Task } from "../lib/task/Task"
import { completedState, initialState } from "../lib/task/state"
import { Chat } from "./Chat"

export function useFetchChats(): [(eventId: number) => Promise<Chat[]>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const fun = useCallback(async (eventId: number) => {
    setState({ ...initialState, isLoading: true })

    try {
      const chats: Chat[] = (await httpGet("chats", { event: eventId }, user!.token) as any[])
        .map(item =>
          ({ ...item, timestamp: new Date(item.timestamp) })
        )

      setState({ ...completedState, isSuccessful: true })

      return chats
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
