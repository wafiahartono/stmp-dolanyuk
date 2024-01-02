import { Game } from "./index"

export type Event = {
  id: number
  game: Game
  title: string
  datetime: Date
  location: {
    place: string
    address: string
  }
  participants: number
  participant: boolean
}
