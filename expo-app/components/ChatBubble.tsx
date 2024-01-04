import { Check, CheckCheck } from "@tamagui/lucide-icons"
import { memo } from "react"
import { Avatar, Paragraph, SizableText, XStack, YStack } from "tamagui"
import { amber, blue, cyan, emerald, fuchsia, green, indigo, lime, orange, pink, purple, red, rose, sky, teal, violet, yellow } from "../utils/colors"

import { Chat } from "../data/Chat"

const nameTextColors = [
  red[800],
  orange[800],
  amber[800],
  yellow[800],
  lime[800],
  green[800],
  emerald[800],
  teal[800],
  cyan[800],
  sky[800],
  blue[800],
  indigo[800],
  violet[800],
  purple[800],
  fuchsia[800],
  pink[800],
  rose[800],
]

export const ChatBuble = memo(
  Component,
  (a, b) =>
    a.chat.id === b.chat.id &&
    a.chat.timestamp.getTime() === a.chat.timestamp.getTime(),
)

function Component({ chat }: { chat: Chat }) {
  return (
    <XStack
      fd={chat.user.self ? "row-reverse" : "unset"}
      paddingVertical="$1"
      space="$2"
    >
      {!chat.user.self &&
        <Avatar size="$2" alignSelf="flex-end" circular>
          <Avatar.Image src={`https://i.pravatar.cc/150?u=${chat.user.name}`} />
        </Avatar>}

      <YStack>
        {!chat.user.self &&
          <SizableText
            size="$1"
            style={{ color: nameTextColors[nameTextColors.length % chat.user.id] }}
          >
            {chat.user.name}
          </SizableText>
        }

        <Paragraph
          maw="$20"
          mt="$0.5"
          paddingVertical="$2"
          paddingHorizontal="$3"
          bc={chat.user.self ? "$blue6" : "$gray6"}
          br="$6"
          fos="$4"
          lh="$1"
        >
          {chat.text}
        </Paragraph>
      </YStack>

      <XStack alignSelf="flex-end" ai="center" space="$1.5">
        {chat.user.self &&
          (chat as any).loading
          ? <Check color="$gray10" size="$radius.6" />
          : <CheckCheck color="$gray10" size="$radius.6" />}

        <SizableText size="$1" col="$gray10">
          {chat.timestamp.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}
        </SizableText>
      </XStack>
    </XStack>
  )
}
