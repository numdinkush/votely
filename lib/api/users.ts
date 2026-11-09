import { Role } from "@/constants/enums"
import { db } from "@/lib/mock/db"
import type { User, UserRecord } from "@/types/auth"

/** Strips server-only fields before data leaves the mock API. */
export function toPublicUser(record: UserRecord): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...user } = record
  return user
}

export async function listUsers(): Promise<User[]> {
  return (await db.users.list()).map(toPublicUser)
}

/** Buying the nomination form promotes a voter to candidate. */
export async function purchaseCandidateForm(userId: string): Promise<User> {
  const user = await db.users.get(userId)
  if (user.role !== Role.VOTER) {
    throw new Error("Only voters can purchase a candidate form")
  }
  return toPublicUser(await db.users.update(userId, { role: Role.CANDIDATE }))
}
