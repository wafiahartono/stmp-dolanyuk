import { ArrowLeftSquare, Clock, Map } from "@tamagui/lucide-icons"
import { useRouter } from "expo-router"
import React, { memo, useCallback } from "react"
import { Alert, ToastAndroid } from "react-native"
import {
  Button,
  Card,
  H2,
  H6,
  Image,
  SizableText, Spinner, Text,
  XStack,
  YStack,
} from "tamagui"

import { Event, useJoinEvent, useLeaveEvent } from "../data"

type EventCardProps = {
  event: Event
}

export const EventCard = memo(
  Component,
  (a, b) =>
    a.event.participant === b.event.participant &&
    a.event.participants === b.event.participants
)

function Component({ event }: EventCardProps) {
  const router = useRouter()

  const [joinEvent, joinEventState] = useJoinEvent()

  const handleJoin = useCallback(() => {
    Alert.alert(
      "Join Game Party",
      "Are you sure you want to join this game party? Your commitment is appreciated.",
      [
        { text: "Cancel" },
        {
          text: "Confirm",
          onPress: () => joinEvent(event)
            .then(() => {
              ToastAndroid.show("Welcome to the party. Start a chat in the room 🎉", ToastAndroid.LONG)
            })
            .catch(() => {
              ToastAndroid.show("Unable to join party. Please try again later.", ToastAndroid.LONG)
            }),
        },
      ],
    )
  }, [event])

  const [leaveEvent, leaveEventState] = useLeaveEvent()

  const handleLeave = useCallback(() => {
    Alert.alert(
      "Leave Game Party",
      "Are you sure you want to leave this game party?",
      [
        { text: "Cancel" },
        {
          text: "Leave",
          onPress: () => leaveEvent(event)
            .then(() => {
              ToastAndroid.show("You left the party 😞", ToastAndroid.LONG)
            })
            .catch(() => {
              ToastAndroid.show("Unable to leave party. Please try again later.", ToastAndroid.LONG)
            }),
        },
      ],
    )
  }, [])

  return (
    <Card key={event.id} overflow="hidden" bordered>
      <Card.Header padded>
        <YStack ai="center" jc="center" p="$1" br="$4" bc="$gray1" h="$6" w="$6">
          <SizableText size="$8" col="$blue10">
            {event.datetime.getDate()}
          </SizableText>

          <SizableText size="$4" mt="$-2" col="$gray11">
            {event.datetime.toLocaleDateString("default", { month: "short" })}
          </SizableText>
        </YStack>

        {event.participant &&
          <Button
            pos="absolute"
            r={0}
            m="$4"
            theme="blue"
            circular
            icon={leaveEventState.isLoading ? <Spinner /> : <ArrowLeftSquare />}
            scaleIcon={1.5}
            onPress={handleLeave} />}

        <H6 mt="$2">{event.game.name}</H6>

        <H2 fow="800" ls={-1}>{event.title}</H2>

        <XStack ai="center" mt="$2" space="$3">
          <Clock size="$1" />
          <Text fow="bold">
            {event.datetime.toLocaleTimeString("default", { hour: "2-digit", "minute": "2-digit" })}
          </Text>
        </XStack>

        <XStack ai="center" mt="$1.5" space="$3">
          <Map size="$1" />
          <YStack>
            <Text fow="bold">{event.location.place}</Text>
            <Text>{event.location.address}</Text>
          </YStack>
        </XStack>
      </Card.Header>

      <Card.Footer
        paddingVertical="$3"
        paddingHorizontal="$4"
        bc="$blue2"
        pressStyle={{ bc: "$blue4" }}
      >
        <XStack f={1} ai="center" jc="space-between">
          <SizableText>
            {event.participants < event.game.minPlayers
              ? `Need ${event.game.minPlayers - event.participants} more players`
              : event.participant
                ? `You and ${event.participants - 1} other players joined`
                : `Join the other ${event.participants} players`}
          </SizableText>

          {event.participant
            ? <Button
              br="$4"
              onPress={() => router.push({ pathname: `/chats/${event.id}`, params: { title: event.title } })}
            >
              Open chat
            </Button>

            : <Button
              br="$4"
              iconAfter={joinEventState.isLoading ? <Spinner /> : null}
              onPress={handleJoin}
            >
              Join Party
            </Button>}
        </XStack>
      </Card.Footer>

      <Card.Background bc="$blue4" o={0.2}>
        <Image
          width="100%"
          height="100%"
          blurRadius={8}
          source={{
            width: 800,
            height: 800,
            uri: `https://picsum.photos/seed/${event.title}/800/800`
          }} />
      </Card.Background>
    </Card>
  )
}
