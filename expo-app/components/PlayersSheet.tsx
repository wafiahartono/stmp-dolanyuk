import React, { memo, useEffect, useState } from "react"
import { ToastAndroid } from "react-native"
import { Avatar, H4, Label, ListItem, Separator, Sheet, Unspaced, YGroup } from "tamagui"

import { Event } from "../data/Event"
import { Player } from "../data/Player"
import { useFetchPlayers } from "../data/use-fetch-players"

type PlayersSheetProps = {
  event: Event | null,
  onClose: () => void,
}

export const PlayersSheet = memo(
  Component,
  (a, b) => a.event?.id === b.event?.id,
)

function Component({ event, onClose }: PlayersSheetProps) {
  useEffect(() => {
    if (!event) return

    let ignore = false

    fetchPlayers(event.id)
      .then((players) => {
        if (ignore) return

        setPlayers(players)
      })
      .catch(() => {
        if (ignore) return

        ToastAndroid.show("An unexpected error has occurred.", ToastAndroid.LONG)
      })

    return () => { ignore = true }
  }, [event])

  const [players, setPlayers] = useState<Player[]>([])
  const [fetchPlayers, fetchPlayersState] = useFetchPlayers()

  return (
    <Sheet
      open={!!event}
      onOpenChange={(open: boolean) => !open && onClose()}
      snapPointsMode="fit"
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Frame p="$4">
        <Unspaced>
          <H4 ta="center">
            {event?.title}
          </H4>

          <Label ta="center">
            {fetchPlayersState.isLoading ? "Loading partcipants..." : "Party Participants"}
          </Label>
        </Unspaced>

        {!fetchPlayersState.isLoading &&
          <YGroup size="$4" bordered separator={<Separator />}>
            {players.map(player =>
              <YGroup.Item key={player.id}>
                <ListItem
                  icon={
                    <Avatar size="$2" circular>
                      <Avatar.Image
                        src={player.picture ?? `https://i.pravatar.cc/150?u=${player.name}`} />
                    </Avatar>
                  }>
                  {player.name}
                </ListItem>
              </YGroup.Item>
            )}
          </YGroup>
        }
      </Sheet.Frame>
    </Sheet>
  )
}
