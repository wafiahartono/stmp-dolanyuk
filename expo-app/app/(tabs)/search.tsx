import { RotateCw, Search as SearchIcon, X } from "@tamagui/lucide-icons"
import React, { useMemo, useState } from "react"
import { FlatList } from "react-native"
import {
  Button,
  Circle,
  Input,
  Spinner,
  Stack,
  XStack,
  YStack,
  getTokens,
  useTheme,
} from "tamagui"

import { EventCard } from "../../components/EventCard"
import { useEvents } from "../../data"
import { useFetchEvents } from "../../data/use-fetch-events"

export default function Search() {
  const theme = useTheme()

  const events = useEvents()
  const [fetchEvents, fetchEventsState] = useFetchEvents()

  const [query, setQuery] = useState("")

  const displayedEvents = useMemo(() => {
    return events.filter(event => {
      const now = new Date().getTime()
      const q = query.toLowerCase()

      return !event.participant &&
        event.datetime.getTime() >= now &&
        (event.title.toLowerCase().includes(q)
          || event.game.name.toLowerCase().includes(q)
          || event.location.address.toLowerCase().includes(q))
    })
  }, [events, query])

  return (
    <YStack f={1} bc="$backgroundStrong">
      <XStack p="$4" bc="$backgroundStrong" space="$4">
        <YStack f={1} jc="center">
          <Input
            pl="$8"
            placeholder="Search fun activities..."
            value={query}
            onChangeText={setQuery} />

          <SearchIcon
            size="$1"
            color={theme.color6.val}
            style={{
              position: "absolute",
              left: getTokens().space["3.5"].val,
            }} />

          {query &&
            <Circle
              size="$3"
              pos="absolute"
              r="$2.5"
              pressStyle={{
                backgroundColor: theme.gray6
              }}
              onPress={() => setQuery("")}
            >
              <X size="$1" color={theme.color6.val} />
            </Circle>}
        </YStack>
      </XStack>

      <FlatList
        data={displayedEvents}
        keyExtractor={event => event.id.toString()}
        ItemSeparatorComponent={() => <Stack h="$1" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: getTokens().size["7"].val,
          paddingHorizontal: getTokens().space["4"].val,
        }} />

      <Button
        theme="blue"
        pos="absolute"
        b={0}
        alignSelf="center"
        mb="$3.5"
        icon={fetchEventsState.isLoading ? <Spinner /> : <RotateCw />}
        onPress={fetchEvents}
      >
        Refresh
      </Button>
    </YStack>
  )
}
