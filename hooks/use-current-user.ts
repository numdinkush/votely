"use client"

import { useAppSelector } from "@/store/hooks"
import type { User } from "@/types/auth"

export const useCurrentUser = (): User | null =>
  useAppSelector((s) => s.auth.user)

/** For views rendered behind the auth guard, where a user always exists. */
export function useAuthUser(): User {
  const user = useCurrentUser()
  if (!user) throw new Error("useAuthUser must be used inside the auth guard")
  return user
}
