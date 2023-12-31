import { useRouter } from "expo-router"
import { useEffect } from "react"
import { Button, H1, Text, YStack } from "tamagui"

import { useAuth, useSignOut } from "../providers/auth"

export default function Index() {
  const router = useRouter()

  const { user } = useAuth()
  const signOut = useSignOut()

  useEffect(() => {
    user === null && router.replace("/signin")
  }, [user])

  if (!user) return null

  return (
    <YStack f={1} jc="center" p="$4" bc="$backgroundStrong">
      <H1 ta="center" ls={-2}>
        DolanYuk Home
      </H1>

      <Text mt="$4" ta="center">
        Logged in as {user.name} ({user.email})
      </Text>

      <Button mt="$4" onPress={() => signOut()}>
        Log Out
      </Button>
    </YStack>
  )
}
