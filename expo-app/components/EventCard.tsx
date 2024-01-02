import { ArrowLeftSquare, Clock, Map } from "@tamagui/lucide-icons"
import React, { memo } from "react"
import { Alert, ToastAndroid } from "react-native"
import {
  Button,
  Card,
  H2,
  H6,
  Image,
  SizableText, Text,
  XStack,
  YStack,
} from "tamagui"

import { Event } from "../data"
import { useJoinEvent } from "../data/use-join-event"

export const EventCard = memo(function EventCard({ event }: { event: Event }) {
  const [joinEvent] = useJoinEvent()

  return (
    <Card key={event.id} overflow="hidden" bordered>
      <Card.Header padded>
        <YStack ai="center" jc="center" p="$1" br="$4" bc="$gray1" h="$6" w="$6">
          <SizableText size="$8" col="$blue10">
            {event.datetime.getDate()}
          </SizableText>

          <SizableText size="$4" mt="$-2" col="$gray11">
            {event.datetime.toLocaleDateString("id-ID", { month: "short" })}
          </SizableText>
        </YStack>

        {event.participant &&
          <Button
            pos="absolute"
            r={0}
            m="$4"
            theme="blue"
            circular
            icon={<ArrowLeftSquare />}
            scaleIcon={1.5}
            onPress={() => {
              Alert.alert(
                "Leave Game Party",
                "Are you sure you want to leave this game party?",
                [
                  { text: "Cancel" },
                  {
                    text: "Leave",
                    onPress: () => {
                      Alert.alert(
                        "Unable to Leave Party",
                        "Sorry, an unexpected error has happened on our ends. Please try again later."
                      )
                    }
                  },
                ])
            }} />}

        <H6 mt="$2">{event.game.name}</H6>

        <H2 fow="800" ls={-1}>{event.title}</H2>

        <XStack ai="center" mt="$2" space="$3">
          <Clock size="$1" />
          <Text fow="bold">
            {event.datetime.toLocaleTimeString("id-ID", { hour: "2-digit", "minute": "2-digit" })}
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
        pressStyle={{
          bc: "$blue4"
        }}
      >
        <XStack f={1} ai="center" jc="space-between">
          <Text>
            {event.participant ?
              `You and ${event.participants - 1} other players joined`
              :
              event.participants < event.game.minPlayers ?
                `Need ${event.game.minPlayers - event.participants} more players`
                :
                `Join the other ${event.participants} players`}
          </Text>

          {event.participant ?
            <Button
              theme="purple"
              br="$4"
              onPress={() => {
              }}>
              Open chat
            </Button>

            :

            <Button
              br="$4"
              onPress={() => {
                Alert.alert(
                  "Join Game Party",
                  "Are you sure you want to join this game party? Your commitment is appreciated.",
                  [
                    { text: "Cancel" },
                    {
                      text: "Confirm",
                      onPress: () => joinEvent(event)
                        .then(() => {
                          ToastAndroid.show("You just joined this party. Start a chat in the room!", 3000)
                        })
                        .catch(() => {
                          Alert.alert(
                            "Unable to Join Party",
                            "Sorry, an unexpected error has happened on our ends. Please try again later."
                          )
                        })
                    },
                  ])
              }}>
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
})
