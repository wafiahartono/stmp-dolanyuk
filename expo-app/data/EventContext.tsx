
import React from "react"

import { Event } from "./index"

export type DispatchAction =
  {
    type: "refresh"
    payload: Event[]
  } |
  {
    type: "add" | "update"
    payload: Event
  }

const Context = React.createContext<Event[] | null>(null)

const DispatchContext = React.createContext<React.Dispatch<DispatchAction> | null>(null)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, dispatch] = React.useReducer(reducer, [])

  return (
    <Context.Provider value={events}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </Context.Provider>
  )
}

function reducer(events: Event[], action: DispatchAction) {
  switch (action.type) {
    case "refresh": {
      return [...action.payload]
    }
    case "add": {
      let index = events.findIndex(event =>
        event.datetime.getTime() > action.payload.datetime.getTime()
      )
      if (index === -1) index = events.length

      return [
        ...events.slice(0, index > 0 ? index : 0),
        action.payload,
        ...events.slice(index),
      ]
    }
    case "update": {
      return events.map(event => event.id === action.payload.id ?
        action.payload : event
      )
    }
  }
}

export function useEvents() {
  return React.useContext(Context)!
}

export function useEventDispatch() {
  return React.useContext(DispatchContext)!
}
