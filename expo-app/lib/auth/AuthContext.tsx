import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

import { User } from "./User"

type AuthContext = {
  user: User | null
}

type DispatchAction = {
  type: "update" | "clear"
  user: User | null
}

const Context = React.createContext<AuthContext | null>(null)

const DispatchContext = React.createContext<React.Dispatch<DispatchAction> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    let ignore = false

    AsyncStorage.getItem("auth").then(string => {
      if (ignore) return

      dispatch({
        type: "update",
        user: string ? JSON.parse(string).user : null,
      })
    })

    return () => { ignore = true }
  }, [])

  const [state, dispatch] = React.useReducer(reducer, {} as AuthContext)

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </Context.Provider>
  )
}

function reducer(state: AuthContext, action: DispatchAction): AuthContext {
  switch (action.type) {
    case "update": {
      return { user: action.user }
    }
    case "clear": {
      return { user: null }
    }
    default: {
      throw new Error(`Unknown action: ${action.type}`)
    }
  }
}

export function useAuth() {
  return React.useContext(Context)!
}

export function useAuthDispatch() {
  return React.useContext(DispatchContext)!
}
