import { RotateCw, Search as SearchIcon, X } from "@tamagui/lucide-icons"
import React, { useMemo, useState } from "react"
import { FlatList } from "react-native"
import {
  Button,
  Circle,
  Image,
  Input,
  SizableText,
  Spinner,
  Stack,
  XStack,
  YStack,
  ZStack,
  getTokens,
  useTheme,
} from "tamagui"

import { EventCard } from "../../components/EventCard"
import { useEvents } from "../../data"
import { useFetchEvents } from "../../data/use-fetch-events"

export default function Search() {
  const theme = useTheme()

  const eventsStore = useEvents()
  const [fetchEvents, fetchEventsState] = useFetchEvents()

  const [query, setQuery] = useState("")

  const events = useMemo(() => {
    return eventsStore.filter(event => {
      const now = new Date().getTime()
      const q = query.toLowerCase()

      return !event.participant &&
        event.datetime.getTime() >= now &&
        (event.title.toLowerCase().includes(q)
          || event.game.name.toLowerCase().includes(q)
          || event.location.address.toLowerCase().includes(q))
    })
  }, [eventsStore, query])

  return (
    <YStack f={1} bc="$backgroundStrong">
      <XStack p="$4" bc="$backgroundStrong" space="$4">
        <XStack f={1} ai="center">
          <Input
            f={1}
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
        </XStack>
      </XStack>

      <ZStack f={1}>
        <YStack f={1} ai="center" jc="center">
          {fetchEventsState.isLoading &&
            <SizableText>
              Loading your parties...
            </SizableText>
          }

          {fetchEventsState.isComplete && events.length === 0 &&
            <>
              <Image
                width={getTokens().size["20"].val}
                height={getTokens().size["20"].val}
                source={require("../../assets/connectivity.png")} />

              <SizableText mt="$-4">
                Hmmm this is unexpected.
              </SizableText>
            </>
          }
        </YStack>

        {useMemo(() =>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 0,
              paddingBottom: getTokens().size["7"].val,
              paddingHorizontal: getTokens().space["4"].val,
            }}
            data={events}
            keyExtractor={event => event.id.toString()}
            renderItem={({ item }) => <EventCard event={item} />}
            ItemSeparatorComponent={() => <Stack h="$1" />} />,
          [events],
        )}
      </ZStack>

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
