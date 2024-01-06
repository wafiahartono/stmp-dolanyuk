import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Alert, ToastAndroid } from "react-native"
import { Avatar, Button, Circle, H4, SizableText, Spinner, YStack } from "tamagui"

import { ArrowRightSquare, Image, Trash } from "@tamagui/lucide-icons"
import { InputField } from "../../components/InputField"
import { useEventDispatch } from "../../data/EventContext"
import { File } from "../../lib/api/File"
import { InvalidUserError } from "../../lib/api/InvalidUserError"
import { useAuth } from "../../lib/auth/AuthContext"
import { User } from "../../lib/auth/User"
import { useSignOut } from "../../lib/auth/use-sign-out"
import { UpdateProfileParams, useUpdateProfile } from "../../lib/auth/use-update-profile"

export default function Profile() {
  const router = useRouter()

  const { user } = useAuth()

  const signOut = useSignOut()

  const [picture, setPicture] = useState<File | null>(null)

  const handlePickPicture = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.assets) return

    const asset = result.assets[0]
    const extension = asset.uri.split(".").pop()

    setPicture({
      uri: asset.uri,
      name: `picture.${extension}`,
      type: `${asset.type}/${extension}`,
    })
  }, [])

  const [name, setName] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState("")
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null)

  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState<string | null>(null)

  const updatePicture = !!picture
  const updateName = name.trim().length > 0
  const updatePassword = currentPassword.length > 0 || newPassword.length > 0

  const pendingChanges = picture || updateName || updatePassword

  const [updateProfileState, updateProfile] = useUpdateProfile()

  const handleUpdateProfile = useCallback(() => {
    if (!pendingChanges) return

    let validated = true

    if (updatePassword) {
      if (currentPassword.length === 0) {
        setCurrentPasswordError("This field is required.")
        validated = false
      } else {
        setCurrentPasswordError(null)
      }

      if (newPassword.length === 0) {
        setNewPasswordError("This field is required.")
        validated = false
      } else {
        setNewPasswordError(null)
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

    if (!validated) return

    const params: UpdateProfileParams = {}

    if (updatePicture) {
      params.picture = picture
    }

    if (updateName) {
      params.name = name
    }

    if (updatePassword) {
      params.current_password = currentPassword
      params.new_password = newPassword
    }

    updateProfile(params)
      .then(() => {
        setPicture(null)
        setName("")
        setCurrentPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")

        ToastAndroid.show("Profile updated.", ToastAndroid.LONG)
      })
      .catch(error => {
        if (error instanceof InvalidUserError) {
          setCurrentPasswordError("The provided password is incorrect")
        } else {
          ToastAndroid.show("An unexpected error has occurred.", ToastAndroid.LONG)
        }
      })
  }, [picture, name, currentPassword, newPassword, newPasswordConfirm])

  const eventDispatch = useEventDispatch()

  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel" },
        {
          text: "Sign Out",
          onPress: () => signOut()
            .then(() => {
              eventDispatch({ type: "refresh", payload: [] })

              router.replace("/signin")
            })
        },
      ],
    )
  }, [])

  if (!user) return null

  return (
    <YStack
      f={1}
      jc="center"
      p="$8"
      bc="$backgroundStrong"
    >
      <YStack alignSelf="center">
        <Avatar
          size="$10"
          bw={picture ? "$0.75" : "$0"}
          boc="$blue8"
          circular
        >
          <Avatar.Image src={picture
            ? picture.uri
            : user.picture ?? `https://i.pravatar.cc/150?u=${user.name}`} />
        </Avatar>

        <Circle
          themeInverse
          pressTheme
          size="$3"
          pos="absolute"
          b={-4}
          r={-4}
          bc="$background"
          onPress={() => picture ? setPicture(null) : handlePickPicture()}
        >
          {picture
            ? <Trash size="$1" color="white" />
            : <Image size="$1" color="white" />}
        </Circle>
      </YStack>

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
          error={newPasswordError} />

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
        color={pendingChanges ? "unset" : "$gray10Light"}
        bc={pendingChanges ? "unset" : "$gray4Light"}
        iconAfter={updateProfileState.isLoading ? <Spinner /> : null}
        onPress={handleUpdateProfile}
      >
        Update Profile
      </Button>

      <Button
        mt="$4"
        iconAfter={<ArrowRightSquare size="$1" />}
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
    </YStack>
  )
}
