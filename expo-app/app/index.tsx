import { Redirect, useRouter } from "expo-router"
import { useEffect } from "react"

import { useAuth } from "../lib/auth/AuthContext"

export default function Index() {
  const { user } = useAuth()

  const router = useRouter()

  useEffect(() => {
    user === null && router.replace("/signin")
  }, [user])

  if (!user) return null

  return <Redirect href="/events" />
}
