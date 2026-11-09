import type { Role } from "@/constants/enums"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  /** Profile data used to check candidacy criteria. */
  age: number
  membershipYears: number
}

/** Stored user (mock DB only; never sent to the client). */
export type UserRecord = User & { password: string }

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  user: User
  token: string
}

export interface ApiError {
  message: string
}
