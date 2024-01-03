import { Plus } from "@tamagui/lucide-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useMemo } from "react"
import { FlatList } from "react-native"
import {
  Button,
  Stack,
  ZStack,
  getTokens
} from "tamagui"

import { EventCard } from "../../components/EventCard"
import { useEvents } from "../../data"
import { useFetchEvents } from "../../data/use-fetch-events"

export default function Events() {
  useEffect(() => { fetchEvents() }, [])

  const events = useEvents()
  const [fetchEvents] = useFetchEvents()

  const displayedEvents = useMemo(() => {
    const now = new Date().getTime()
    return events.filter(event => event.participant && event.datetime.getTime() >= now)
  }, [events])

  const router = useRouter()

  return (
    <ZStack f={1} bc="$backgroundStrong">
      <FlatList
        data={displayedEvents}
        keyExtractor={event => event.id.toString()}
        ItemSeparatorComponent={() => <Stack h="$1" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCard event={item} />}
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
        icon={<Plus size="$1" />}
        onPress={() => router.push("/create-event")}
      >
        New event
      </Button>
    </ZStack>
  )
}
