import { ApplicationStatus, ElectionStatus, Role } from "@/constants/enums"
import { isEligible } from "@/lib/eligibility"
import { toPublicUser } from "@/lib/api/users"
import { db } from "@/lib/mock/db"
import type {
  Candidate,
  CandidateDetails,
  CandidateInput,
} from "@/types/election"

/** Joins candidates with their user, election and position for display. */
async function withDetails(rows: Candidate[]): Promise<CandidateDetails[]> {
  const [users, elections] = await Promise.all([
    db.users.list(),
    db.elections.list(),
  ])

  return rows.flatMap((row) => {
    const user = users.find((u) => u.id === row.userId)
    const election = elections.find((e) => e.id === row.electionId)
    const position = election?.positions.find((p) => p.id === row.positionId)
    if (!user || !election || !position) return []

    return {
      ...row,
      user: toPublicUser(user),
      electionTitle: election.title,
      positionTitle: position.title,
    }
  })
}

export async function listCandidates(): Promise<CandidateDetails[]> {
  return withDetails(await db.candidates.list())
}

export async function listCandidatesForUser(
  userId: string
): Promise<CandidateDetails[]> {
  const rows = await db.candidates.list()
  return withDetails(rows.filter((c) => c.userId === userId))
}

/** Admin: add a candidate directly (promotes a voter to candidate). */
export async function createCandidate(
  input: CandidateInput
): Promise<Candidate> {
  const user = await db.users.get(input.userId)
  if (user.role === Role.VOTER) {
    await db.users.update(user.id, { role: Role.CANDIDATE })
  }
  return db.candidates.create({
    ...input,
    createdAt: new Date().toISOString(),
  })
}

export const updateCandidate = ({
  id,
  ...patch
}: Partial<CandidateInput> & { id: string }): Promise<Candidate> =>
  db.candidates.update(id, patch)

/** Removing a candidate also discards the votes cast for them. */
export async function deleteCandidate(id: string): Promise<string> {
  await db.votes.removeWhere((v) => v.candidateId === id)
  return db.candidates.remove(id)
}

/** Candidate: apply for a position (validates window, eligibility, duplicates). */
export async function applyForPosition(args: {
  userId: string
  electionId: string
  positionId: string
}): Promise<Candidate> {
  const [user, election, existing] = await Promise.all([
    db.users.get(args.userId),
    db.elections.get(args.electionId),
    db.candidates.list(),
  ])
  const position = election.positions.find((p) => p.id === args.positionId)

  if (!position) throw new Error("Position not found")
  if (election.status !== ElectionStatus.APPLICATIONS_OPEN) {
    throw new Error("Applications are not open for this election")
  }
  if (!isEligible(toPublicUser(user), position)) {
    throw new Error("You do not meet the criteria for this position")
  }
  if (
    existing.some(
      (c) => c.userId === user.id && c.positionId === position.id
    )
  ) {
    throw new Error("You have already applied for this position")
  }

  return db.candidates.create({
    ...args,
    status: ApplicationStatus.PENDING,
    note: "",
    createdAt: new Date().toISOString(),
  })
}
