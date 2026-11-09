import { toPublicUser } from "@/lib/api/users"
import { db } from "@/lib/mock/db"
import type { AuthSession, LoginCredentials } from "@/types/auth"

export async function login({
  email,
  password,
}: LoginCredentials): Promise<AuthSession> {
  const users = await db.users.list()
  const match = users.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  )
  if (!match) throw new Error("Invalid email or password")

  return { user: toPublicUser(match), token: `mock-token-${match.id}` }
}
