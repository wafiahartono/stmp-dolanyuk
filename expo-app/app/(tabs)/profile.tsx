import { useRouter } from "expo-router"
import { Button, Text, YStack } from "tamagui"

import { User, useAuth, useSignOut } from "../../lib/auth"

export default function Profile() {
  const router = useRouter()

  const { user } = useAuth() as { user: User }

  const signOut = useSignOut()

  return (
    <YStack
      f={1}
      ai="center"
      jc="center"
      p="$4"
      backgroundColor="$backgroundStrong"
      space
    >
      <Text>
        Logged in as {user.name} ({user.email})
      </Text>

      <Button
        onPress={() => {
          signOut()
          router.replace("/signin")
        }}
      >
        Log out
      </Button>
    </YStack>
  )
}
