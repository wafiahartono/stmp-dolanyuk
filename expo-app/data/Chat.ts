export type Chat = {
  id: number
  timestamp: Date
  user: {
    id: number
    name: string
    picture: string
    self: boolean
  }
  text: string
}
