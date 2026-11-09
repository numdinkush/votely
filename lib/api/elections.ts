import { db } from "@/lib/mock/db"
import type { Election, ElectionInput } from "@/types/election"

export const listElections = (): Promise<Election[]> => db.elections.list()

export const createElection = (input: ElectionInput): Promise<Election> =>
  db.elections.create(input)

export const updateElection = ({
  id,
  ...patch
}: Partial<ElectionInput> & { id: string }): Promise<Election> =>
  db.elections.update(id, patch)

/** Deleting an election also removes its candidates and votes. */
export async function deleteElection(id: string): Promise<string> {
  await db.candidates.removeWhere((c) => c.electionId === id)
  await db.votes.removeWhere((v) => v.electionId === id)
  return db.elections.remove(id)
}
