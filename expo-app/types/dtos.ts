export interface User {
  id: number
  email: string
  name: string
  picture: string
}

export interface Credentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface AuthResult {
  user?: User
  token?: string
}
