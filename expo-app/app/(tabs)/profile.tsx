import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { ToastAndroid } from "react-native"
import { Avatar, Button, H4, SizableText, Spinner, YStack } from "tamagui"

import { InputField } from "../../components/InputField"
import { InvalidUserError } from "../../lib/api/InvalidUserError"
import { useAuth } from "../../lib/auth/AuthContext"
import { User } from "../../lib/auth/User"
import { useSignOut } from "../../lib/auth/use-sign-out"
import { UpdateProfileParams, useUpdateProfile } from "../../lib/auth/use-update-profile"

export default function Profile() {
  const router = useRouter()

  const { user } = useAuth() as { user: User }

  const signOut = useSignOut()

  const [name, setName] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState("")

  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState<string | null>(null)

  const updateName = name.trim().length > 0
  const updatePassword = newPassword.length > 0

  const pendingChanges = updateName || updatePassword

  const [updateProfileState, updateProfile] = useUpdateProfile()

  const handleUpdateProfile = useCallback(() => {
    if (!pendingChanges) return

    let validated = true

    if (updatePassword) {
      if (currentPassword.length === 0) {
        setCurrentPassword("This field is required.")
        validated = false
      } else {
        setCurrentPasswordError(null)
      }

      if (newPasswordConfirm.length === 0) {
        setNewPasswordConfirmError("This field is required.")
        validated = false

      } else {

        if (newPasswordConfirm.localeCompare(newPassword)) {
          setNewPasswordConfirmError("The new password confirmation does not match.")
          validated = false

        } else {
          setNewPasswordConfirmError(null)
        }
      }
    }

    if (validated) {
      const params: UpdateProfileParams = {}

      if (updateName) {
        params.name = name
      }

      if (updatePassword) {
        params.current_password = currentPassword
        params.new_password = newPassword
      }

      updateProfile(params)
        .then(() => {
          ToastAndroid.show("Profile updated.", ToastAndroid.LONG)
        })
        .catch(error => {
          if (error instanceof InvalidUserError) {
            setCurrentPasswordError("The provided password is incorrect")
          } else {
            ToastAndroid.show("An unexpected error has occurred.", ToastAndroid.LONG)
          }
        })
    }

  }, [name, currentPassword, newPassword, newPasswordConfirm])

  const handleSignOut = useCallback(() => {
    signOut()
    router.replace("/signin")
  }, [])

  return (
    <YStack
      f={1}
      jc="center"
      p="$8"
      bc="$backgroundStrong"
    >
      <Avatar alignSelf="center" circular size="$8">
        <Avatar.Image
          src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
        />
      </Avatar>

      <H4 alignSelf="center" mt="$4">
        {user.name}
      </H4>

      <SizableText alignSelf="center">
        {user.email}
      </SizableText>

      <YStack mt="$4">
        <InputField
          label="Display Name"
          placeholder="Enter your display name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          error={null} />

        <InputField
          label="Current Password"
          placeholder="Enter your current password"
          autoCapitalize="none"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          error={currentPasswordError} />

        <InputField
          label="New Password"
          placeholder="Choose a strong password"
          autoCapitalize="none"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          error={null} />

        <InputField
          label="Confirm New Password"
          placeholder="Confirm your new password"
          autoCapitalize="none"
          secureTextEntry
          value={newPasswordConfirm}
          onChangeText={setNewPasswordConfirm}
          error={newPasswordConfirmError} />
      </YStack>

      <Button
        themeInverse
        disabled={!pendingChanges || updateProfileState.isLoading}
        mt="$4"
        iconAfter={updateProfileState.isLoading ? <Spinner /> : null}
        onPress={handleUpdateProfile}
      >
        Update Profile
      </Button>

      <Button mt="$4" onPress={handleSignOut}>
        Sign Out
      </Button>
    </YStack>
  )
}
