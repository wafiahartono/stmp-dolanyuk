import { Redirect, useRouter } from "expo-router"
import { useEffect } from "react"

import { useAuth } from "../lib/auth"

export default function Index() {
  const router = useRouter()

  const { user } = useAuth()

  useEffect(() => {
    user === null && router.replace("/signin")
  }, [user])

  if (!user) return null

  return <Redirect href="/events" />
}
