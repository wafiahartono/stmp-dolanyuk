export type Task<T = null> = {
  isLoading: boolean
  isComplete: boolean
  isSuccessful: boolean
  data?: T
  error?: Error
}
