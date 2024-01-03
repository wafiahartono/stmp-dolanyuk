import { useRouter } from "expo-router"
import { useCallback, useId, useState } from "react"
import { ToastAndroid } from "react-native"
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

import { InvalidUserError } from "../lib/api"
import { useSignIn } from "../lib/auth"

export default function SignIn() {
  const emailId = useId()
  const passwordId = useId()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const router = useRouter()

  const [signInState, signIn] = useSignIn()

  const handleSignIn = useCallback(() => {
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

    validated && signIn(email, password)
      .then(() => router.replace("/events"))
      .catch(error => {
        if (error instanceof InvalidUserError) {
          setEmailError("These credentials do not match our records.")
        } else {
          ToastAndroid.show("An unexpected error has occurred.", 3000)
        }
      })
  }, [email, password])

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
        theme={emailError ? "red" : "Input"}
        size="$5"
        placeholder="Enter your email address"
        autoCapitalize="none"
        inputMode="email"
        value={email}
        onChangeText={setEmail} />

      {emailError && <Text mt="$2" col="$red10">{emailError}</Text>}

      <Label htmlFor={passwordId} col={passwordError ? "$red10" : "unset"}>
        Password
      </Label>

      <Input
        id={passwordId}
        theme={passwordError ? "red" : "Input"}
        size="$5"
        placeholder="Enter your password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword} />

      {passwordError && <Text mt="$2" col="$red10">{passwordError}</Text>}

      <Button
        disabled={signInState.isLoading}
        size="$5"
        mt="$5"
        iconAfter={signInState.isLoading ? <Spinner /> : null}
        onPress={handleSignIn}
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
          onPress={() => router.push("/signup")}
          pressStyle={{ col: "$blue8" }}
        >
          Sign up
        </Text>
      </XStack>
    </YStack>
  )
}
