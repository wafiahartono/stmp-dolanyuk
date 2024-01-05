import { SendHorizontal } from "@tamagui/lucide-icons"
import { Stack, useLocalSearchParams } from "expo-router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FlatList, ToastAndroid } from "react-native"
import {
  Circle,
  Image,
  Input,
  SizableText,
  Stack as UIStack,
  XStack,
  YStack,
  ZStack,
  getTokens,
  useTheme,
} from "tamagui"

import { ChatBuble } from "../../components/ChatBubble"
import { Chat } from "../../data/Chat"
import { useFetchChats } from "../../data/use-fetch-chats"
import { useSendChat } from "../../data/use-send-chat"

export default function ChatsScreen() {
  const theme = useTheme()
  const params = useLocalSearchParams()

  const [chats, setChats] = useState<Chat[]>([])
  const [fetchChats, fetchChatsState] = useFetchChats()

  useEffect(() => {
    let ignore = false

    fetchChats(Number.parseInt(params.chats as string))
      .then(chats => {
        if (ignore) return

        setChats(chats.reverse())
      })
      .catch(() => {
        if (ignore) return

        ToastAndroid.show("An unexpected error has occurred.", ToastAndroid.LONG)
      })

    return () => { ignore = true }
  }, [])

  const [message, setMessage] = useState("")
  const [sendMessage] = useSendChat()

  const handleSend = useCallback(() => {
    sendMessage({
      eventId: Number.parseInt(params.chats as string),
      text: message,
    })
      .then(chat => {
        setChats(chats => [chat, ...chats])
        setMessage("")
      })
      .catch(() => {
        ToastAndroid.show("An unexpected error has occurred.", ToastAndroid.LONG)
      })
  }, [message])

  return <>
    <Stack.Screen
      options={{
        statusBarColor: "white",
        headerShown: true,
        headerTitle: `${params.title} Chat`,
      }}
    />

    <YStack f={1} bc="$backgroundStrong">
      <ZStack f={1}>
        <YStack f={1} ai="center" jc="center">
          {fetchChatsState.isLoading &&
            <SizableText>
              Loading conversation...
            </SizableText>
          }

          {fetchChatsState.isComplete && chats.length === 0 &&
            <>
              <Image
                width={getTokens().size["20"].val}
                height={getTokens().size["20"].val}
                source={require("../../assets/messages.png")} />

              <SizableText mt="$-4">
                There's nothing here. Start a conversation!
              </SizableText>
            </>
          }
        </YStack>

        {useMemo(() =>
          <FlatList
            inverted
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: getTokens().space["2"].val }}
            data={chats}
            keyExtractor={chat => chat.id.toString()}
            renderItem={({ item }) => <ChatBuble chat={item} />}
            ItemSeparatorComponent={() => <UIStack h="$0.75" />}
            initialNumToRender={15} />,
          [chats],
        )}
      </ZStack>

      <XStack p="$4" bc="$backgroundStrong" space="$2" elevation="$1">
        <YStack f={1} jc="center">
          <Input
            pr="$8"
            br="$6"
            placeholder="Enter message"
            value={message}
            onChangeText={setMessage} />

          <Circle
            disabled={!message}
            size="$3"
            pos="absolute"
            r="$2.5"
            pressStyle={{ backgroundColor: theme.gray4 }}
            onPress={handleSend}
          >
            <SendHorizontal size="$1" color={message ? theme.color6.val : theme.color4.val} />
          </Circle>
        </YStack>
      </XStack>
    </YStack>
  </>
}
