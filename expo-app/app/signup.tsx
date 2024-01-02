import { useRouter } from "expo-router"
import { useEffect, useId, useState } from "react"
import {
  Button,
  H1,
  H6,
  Input,
  Label,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui"

import { ValidationError } from "../lib/api"
import { useSignUp } from "../lib/auth"

export default function SignUp() {
  const router = useRouter()

  const [signUpState, signUp] = useSignUp()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const passwordConfirmId = useId()

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null)

  useEffect(() => {
    if (!signUpState.isComplete) return

    if (signUpState.isSuccessful) {
      router.replace("/events")

    } else if (signUpState.error instanceof ValidationError) {
      const errors = signUpState.error.errors

      errors["email"] && setEmailError(errors["email"])

    } else {
      setEmailError("An unexpected error has occurred.")
    }
  }, [signUpState])

  return (
    <YStack f={1} jc="center" p="$4" backgroundColor="$backgroundStrong">
      <H1 ls={-2}>
        DolanYuk
      </H1>

      <H6>
        Create new account
      </H6>

      <Label htmlFor={nameId} mt="$4" col={nameError ? "$red10" : "unset"}>
        Display Name
      </Label>

      <Input
        id={nameId}
        size="$5"
        theme={nameError ? "red" : "Input"}
        placeholder="Enter your display name"
        autoCapitalize="words"
        value={name}
        onChangeText={text => setName(text)} />

      {nameError && <Text mt="$2" col="$red10">{nameError}</Text>}

      <Label htmlFor={emailId} col={emailError ? "$red10" : "unset"}>
        Email address
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
        placeholder="Choose a strong password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)} />

      {passwordError && <Text mt="$2" col="$red10">{passwordError}</Text>}

      <Label htmlFor={passwordConfirmId} col={passwordConfirmError ? "$red10" : "unset"}>
        Confirm Password
      </Label>

      <Input
        id={passwordConfirmId}
        size="$5"
        theme={passwordConfirmError ? "red" : "Input"}
        placeholder="Confirm your password"
        autoCapitalize="none"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={text => setPasswordConfirm(text)} />

      {passwordConfirmError && <Text mt="$2" col="$red10">{passwordConfirmError}</Text>}

      <Button
        disabled={signUpState.isLoading}
        size="$5"
        mt="$5"
        iconAfter={signUpState.isLoading ? <Spinner /> : null}
        onPress={() => {
          let validated = true

          if (name.trim().length === 0) {
            setNameError("The display name field is required.")
            validated = false
          } else {
            setNameError(null)
          }

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

          if (passwordConfirm.length === 0) {
            setPasswordConfirmError("The confirm password field is required.")
            validated = false

          } else {

            if (passwordConfirm.localeCompare(password)) {
              setPasswordConfirmError("The password field confirmation does not match.")
              validated = false

            } else {
              setPasswordConfirmError(null)
            }
          }

          validated && signUp(email.trim(), password, name.trim())
        }}
      >
        Sign Up
      </Button>

      <XStack mt="$4" jc="center">
        <Text col="$gray10">
          Already signed up?
        </Text>
        <Text
          ml="$1"
          col="$gray10"
          fow="700"
          onPress={() => router.back()}
          pressStyle={{ col: "$blue10" }}
        >
          Sign in
        </Text>
      </XStack>
    </YStack>
  )
}
