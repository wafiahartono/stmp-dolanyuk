import { useCallback, useState } from "react"

import { httpPost } from "../lib/api/http-post"
import { useAuth } from "../lib/auth/AuthContext"
import { Task } from "../lib/task/Task"
import { completedState, initialState } from "../lib/task/state"
import { Chat } from "./Chat"

type SendChatParams = {
  eventId: number
  text: string
}

export function useSendChat(): [(params: SendChatParams) => Promise<Chat>, Task] {
  const [state, setState] = useState<Task>(initialState)

  const { user } = useAuth()

  const fun = useCallback(async (params: SendChatParams) => {
    setState({ ...initialState, isLoading: true })

    try {
      const chat = await httpPost("chats", { event: params.eventId, ...params }, user!.token)

      chat.timestamp = new Date(chat.timestamp)

      setState({ ...completedState, isSuccessful: true })

      return chat
    } catch (error: any) {
      setState({ ...completedState, isSuccessful: false, error })

      throw error
    }
  }, [user])

  return [fun, state]
}
