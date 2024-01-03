import { Stack, useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ToastAndroid } from "react-native"
import {
  Button,
  ScrollView,
  Spinner,
  YStack
} from "tamagui"

import { DateTimeField } from "../components/DateTimeField"
import { InputField } from "../components/InputField"
import { Item, SelectField } from "../components/SelectField"
import { Game } from "../data"
import { useFetchGames } from "../data/use-fetch-games"
import { useStoreEvent } from "../data/use-store-event"

type GameItem = Game & Item

export default function CreateEvent() {
  useEffect(() => {
    let ignore = false

    getGames()
      .then(games => {
        if (ignore) return

        setGames(games.map<GameItem>(game => ({
          ...game,
          key: game.id.toString(),
          value: game.id.toString(),
          text: `${game.name} (${game.minPlayers} players)`,
        })))
      })
      .catch(() => {
        if (ignore) return

        setGameError("Unable to get game list from server.")
      })

    return () => { ignore = true }
  }, [])

  const [getGames] = useFetchGames()
  const [games, setGames] = useState<GameItem[]>([])

  const [title, setTitle] = useState("Casual Game Night")
  const [titleError, setTitleError] = useState<string | null>(null)

  const [game, setGame] = useState<Game | null>(null)
  const [gameError, setGameError] = useState<string | null>(null)

  const [datetime, setDatetime] = useState<Date | undefined>()
  const [datetimeError, setDatetimeError] = useState<string | null>(null)

  const [venue, setVenue] = useState("Game Station")
  const [venueError, setVenueError] = useState<string | null>(null)

  const [address, setAddress] = useState("Jl. Puncak No. 432, Bogor")
  const [addressError, setAddressError] = useState<string | null>(null)

  const [storeEvent, storeEventState] = useStoreEvent()

  const router = useRouter()

  const handleSubmit = useCallback(() => {
    let validated = true

    if (title.trim().length === 0) {
      setTitleError("This field is required.")
      validated = false
    } else {
      setTitleError(null)
    }

    if (!game) {
      setGameError("This field is required.")
      validated = false
    } else {
      setGameError(null)
    }

    if (!datetime) {
      setDatetimeError("This field is required.")
      validated = false
    } else {
      setDatetimeError(null)
    }

    if (venue.trim().length === 0) {
      setVenueError("This field is required.")
      validated = false
    } else {
      setVenueError(null)
    }

    if (address.trim().length === 0) {
      setAddressError("This field is required.")
      validated = false
    } else {
      setAddressError(null)
    }

    validated && storeEvent({ title, game: game!, datetime: datetime!, venue, address })
      .then(() => {
        ToastAndroid.show("You just scheduled a party 🎉", ToastAndroid.LONG)
        router.back()
      })
      .catch(() => {
        ToastAndroid.show("Unable to save your event.", ToastAndroid.LONG)
      })
  }, [title, game, datetime, venue, address])

  return <>
    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: "Create event",
      }}
    />

    <ScrollView backgroundColor="$backgroundStrong">
      <YStack p="$4">
        <InputField
          label="Event Title"
          placeholder="Enter your event title"
          autoCapitalize="words"
          value={title}
          onChangeText={setTitle}
          error={titleError} />

        <SelectField
          label="Game"
          placeholder="Choose your preferred game"
          items={games}
          error={gameError}
          selectProps={{
            value: game?.id?.toString() ?? "",
            onValueChange: id => setGame(
              games.find(game => game.id.toString() == id) ?? null
            ),
          }} />

        <DateTimeField
          label="Date and Time"
          placeholder="Pick your event date and time"
          value={datetime}
          onValueChange={setDatetime}
          displayValue={datetime => datetime.toLocaleString("default", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          error={datetimeError} />

        <InputField
          label="Venue Name"
          placeholder="Enter your event venue name"
          autoCapitalize="words"
          value={venue}
          onChangeText={setVenue}
          error={venueError} />

        <InputField
          label="Venue Address"
          placeholder="Enter your event venue address"
          autoCapitalize="words"
          value={address}
          onChangeText={setAddress}
          error={addressError} />

        <Button
          disabled={storeEventState.isLoading}
          size="$5"
          mt="$5"
          iconAfter={storeEventState.isLoading ? <Spinner /> : null}
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </YStack>
    </ScrollView>
  </>
}
