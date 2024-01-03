import { Plus, RefreshCw } from "@tamagui/lucide-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useMemo } from "react"
import { FlatList } from "react-native"
import {
  Button,
  Spinner,
  Stack,
  ZStack,
  getTokens,
} from "tamagui"

import { EventCard } from "../../components/EventCard"
import { useEvents } from "../../data"
import { useFetchEvents } from "../../data/use-fetch-events"

export default function Events() {
  useEffect(() => { fetchEvents() }, [])

  const events = useEvents()
  const [fetchEvents, fetchEventsState] = useFetchEvents()

  const displayedEvents = useMemo(() =>
    events.filter(event => event.participant),
    [events],
  )

  const router = useRouter()

  return (
    <ZStack f={1} bc="$backgroundStrong">
      <FlatList
        data={displayedEvents}
        keyExtractor={event => event.id.toString()}
        ItemSeparatorComponent={() => <Stack h="$1" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => index > 0
          ? <EventCard event={item} />
          : <Button
            alignSelf="center"
            theme="blue"
            circular
            icon={fetchEventsState.isLoading ? <Spinner /> : <RefreshCw />}
            scaleIcon={1.5}
            onPress={() => fetchEvents()}
          >
          </Button>}
        contentContainerStyle={{
          padding: getTokens().space["4"].val,
          paddingBottom: getTokens().size["7"].val,
        }} />


      <Button
        pos="absolute"
        b={0}
        alignSelf="center"
        mb="$3.5"
        themeInverse
        bordered
        elevate
        icon={<Plus />}
        onPress={() => router.push("/create-event")}
      >
        New event
      </Button>
    </ZStack>
  )
}
