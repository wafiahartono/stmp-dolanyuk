import { Plus, RefreshCw } from "@tamagui/lucide-icons"
import React from "react"
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
  const events = useEvents()

  const [fetchEvents, fetchEventsState] = useFetchEvents()

  return (
    <ZStack f={1} bc="$backgroundStrong">
      <FlatList
        data={events}
        keyExtractor={event => event.id.toString()}
        ItemSeparatorComponent={() => <Stack h="$1" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: event }) =>
          <EventCard event={event} />
        }
        contentContainerStyle={{
          padding: getTokens().space["4"].val,
          paddingBottom: getTokens().size["7"].val,
        }} />

      <Button
        pos="absolute" b={0}
        mb="$3.5" ml="$4"
        theme="blue"
        bordered elevate
        icon={fetchEventsState.isLoading ? <Spinner /> : <RefreshCw />}
        onPress={() => fetchEvents()}>
        Refresh
      </Button>

      <Button
        pos="absolute" b={0} r={0}
        mb="$3.5" mr="$4"
        themeInverse
        bordered elevate
        icon={<Plus />}
        onPress={() => { }}>
        New event
      </Button>
    </ZStack>
  )
}
