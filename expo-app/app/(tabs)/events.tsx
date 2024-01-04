import { Plus } from "@tamagui/lucide-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useMemo } from "react"
import { FlatList } from "react-native"
import {
  Button,
  Image,
  SizableText,
  Stack,
  YStack,
  ZStack,
  getTokens,
} from "tamagui"

import { EventCard, PlayersSheet } from "../../components"
import { Event, useEvents, useFetchEvents } from "../../data"

export default function Events() {
  useEffect(() => { fetchEvents() }, [])

  const events = useEvents()
  const [fetchEvents, fetchEventsState] = useFetchEvents()

  const displayedEvents = useMemo(() => {
    const now = new Date().getTime()
    return events.filter(event => event.participant && event.datetime.getTime() >= now)
  }, [events])

  const router = useRouter()

  const [playersSheetEvent, setPlayersSheetEvent] = useState<Event | null>(null)

  return (
    <>
      <ZStack f={1} bc="$backgroundStrong">
        <YStack f={1} ai="center" jc="center">
          {fetchEventsState.isLoading &&
            <SizableText>
              Loading your parties...
            </SizableText>
          }

          {fetchEventsState.isComplete && displayedEvents.length === 0 &&
            <>
              <Image
                width={getTokens().size["20"].val}
                height={getTokens().size["20"].val}
                source={require("../../assets/social.png")} />

              <SizableText mt="$-4">
                So lonely out here. Join some parties!
              </SizableText>
            </>
          }
        </YStack>

        {useMemo(() =>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: getTokens().space["4"].val,
              paddingBottom: getTokens().size["7"].val,
            }}
            data={displayedEvents}
            keyExtractor={event => event.id.toString()}
            renderItem={({ item }) => <EventCard
              event={item}
              onOpenPlayersSheet={setPlayersSheetEvent} />}
            ItemSeparatorComponent={() => <Stack h="$1" />} />,
          [displayedEvents],
        )}

        <Button
          pos="absolute"
          b={0}
          alignSelf="center"
          mb="$3.5"
          themeInverse
          icon={<Plus size="$1" />}
          onPress={() => router.push("/create-event")}
        >
          New event
        </Button>
      </ZStack>

      <PlayersSheet
        event={playersSheetEvent}
        onClose={() => setPlayersSheetEvent(null)}
      />
    </>
  )
}
