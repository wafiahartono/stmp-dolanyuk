import { useRouter } from "expo-router"
import { useEffect, useId, useState } from "react"
import {
  Button,
  H1,
  Input,
  Label,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui"

import { useAuth } from "../providers/auth"
import { InvalidUserError } from "../types/errors"

export default function SignIn() {
  const { useSignIn } = useAuth()

  const [signIn, signInState] = useSignIn()

  const router = useRouter()

  const emailId = useId()
  const passwordId = useId()

  const [email, setEmail] = useState("dbrussell1@tiny.cc")
  const [emailError, setEmailError] = useState<string | null>(null)

  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (signInState === undefined) return

    const state = signInState

    if (state === "Unit") {
      router.replace("")

    } else if (state instanceof InvalidUserError) {
      setEmailError("These credentials do not match our records.")

    } else if (state instanceof Error) {
      console.log(state)
      setEmailError("An unexpected error has occurred.")
    }
  }, [signInState])

  return (
    <YStack f={1} jc="center" p="$4" backgroundColor="$backgroundStrong">

      <H1 ls={-2}>
        DolanYuk
      </H1>

      <Label htmlFor={emailId} col={emailError ? "$red10" : "unset"}>
        Email Address
      </Label>

      <Input
        id={emailId}
        size="$5"
        theme={emailError ? "red" : "Input"}
        placeholder="Enter your email address"
        autoCapitalize="none"
        inputMode="email"
        value={email}
        onChangeText={text => setEmail(text)} />

      {emailError && <Text mt="$2" col="$red10">{emailError}</Text>}

      <Label htmlFor={passwordId} col={passwordError ? "$red10" : "unset"}>
        Password
      </Label>

      <Input
        id={passwordId}
        size="$5"
        theme={passwordError ? "red" : "Input"}
        placeholder="Enter your password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)} />

      {passwordError && <Text mt="$2" col="$red10">{passwordError}</Text>}

      <Button
        disabled={signInState === "Loading"}
        size="$5"
        mt="$5"
        icon={signInState === "Loading" ? <Spinner /> : null}
        onPress={() => {
          let validated = true

          if (email.trim().length === 0) {
            setEmailError("The email address field is required.")
            validated = false
          } else {
            setEmailError(null)
          }

          if (password.length === 0) {
            setPasswordError("The password field is required.")
            validated = false
          } else {
            setPasswordError(null)
          }

          validated && signIn({ email, password })
        }}
      >
        Sign In
      </Button>

      <XStack jc="center" mt="$4">

        <Text col="$gray10">
          Don't have an account?
        </Text>

        <Text
          ml="$1"
          col="$gray10"
          fow="700"
          textDecorationLine="underline"
          onPress={() => router.push("signup")}
          pressStyle={{ col: "$gray8" }}
        >
          Sign up
        </Text>

      </XStack>

    </YStack>
  )
}