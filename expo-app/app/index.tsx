import { useRouter } from "expo-router"
import { useEffect } from "react"
import { Button, H1, Text, YStack } from "tamagui"

import { useAuth } from "../providers/auth"

export default function Home() {
  const { user, logout } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return

    user === null && router.replace("signin")
  }, [user])

  if (!user) return null

  return (
    <YStack f={1} jc="center" p="$4">
      <H1 ta="center" ls={-2}>
        DolanYuk Home
      </H1>

      <Text mt="$4" ta="center">
        Logged in as {user.name} ({user.email})
      </Text>

      <Button mt="$4" onPress={() => logout()}>
        Log Out
      </Button>
    </YStack>
  )
}
