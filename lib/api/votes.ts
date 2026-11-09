import { ApplicationStatus, ElectionStatus, Role } from "@/constants/enums"
import { toPublicUser } from "@/lib/api/users"
import { db } from "@/lib/mock/db"
import type {
  BallotInput,
  CandidateTally,
  ElectionResult,
  PositionResult,
  Vote,
} from "@/types/election"

/** Results are visible while voting is open (live) and after it closes (final). */
const RESULT_STATUSES = [ElectionStatus.VOTING_OPEN, ElectionStatus.CLOSED]

export async function listMyVotes(userId: string): Promise<Vote[]> {
  return (await db.votes.list()).filter((v) => v.voterId === userId)
}

/**
 * Casts a ballot. Validates that voting is open, the voter has not already
 * voted in this election, and every pick is an approved candidate for that position.
 */
export async function castBallot(input: BallotInput): Promise<Vote[]> {
  const [election, votes, candidates] = await Promise.all([
    db.elections.get(input.electionId),
    db.votes.list(),
    db.candidates.list(),
  ])

  if (election.status !== ElectionStatus.VOTING_OPEN) {
    throw new Error("Voting is not open for this election")
  }
  if (
    votes.some(
      (v) => v.voterId === input.userId && v.electionId === election.id
    )
  ) {
    throw new Error("You have already voted in this election")
  }

  const picks = Object.entries(input.selections)
  if (picks.length === 0) throw new Error("Select at least one candidate")

  const rows = picks.map(([positionId, candidateId]) => {
    const position = election.positions.find((p) => p.id === positionId)
    if (!position) throw new Error("Position not found")

    const candidate = candidates.find((c) => c.id === candidateId)
    if (
      !candidate ||
      candidate.electionId !== election.id ||
      candidate.positionId !== positionId ||
      candidate.status !== ApplicationStatus.APPROVED
    ) {
      throw new Error(`Invalid candidate selected for ${position.title}`)
    }

    return {
      electionId: election.id,
      positionId,
      candidateId,
      voterId: input.userId,
      createdAt: new Date().toISOString(),
    }
  })

  return db.votes.createMany(rows)
}

/** Tallies for every election that is open for voting or closed. */
export async function listResults(): Promise<ElectionResult[]> {
  const [elections, candidates, votes, users] = await Promise.all([
    db.elections.list(),
    db.candidates.list(),
    db.votes.list(),
    db.users.list(),
  ])

  return elections
    .filter((e) => RESULT_STATUSES.includes(e.status))
    .map((election) => {
      const electionVotes = votes.filter((v) => v.electionId === election.id)

      const positions = election.positions.map((position): PositionResult => {
        const positionVotes = electionVotes.filter(
          (v) => v.positionId === position.id
        )
        const total = positionVotes.length

        const tallies = candidates
          .filter(
            (c) =>
              c.electionId === election.id &&
              c.positionId === position.id &&
              c.status === ApplicationStatus.APPROVED
          )
          .flatMap((c): CandidateTally[] => {
            const user = users.find((u) => u.id === c.userId)
            if (!user) return []
            const count = positionVotes.filter(
              (v) => v.candidateId === c.id
            ).length
            return [
              {
                candidateId: c.id,
                user: toPublicUser(user),
                votes: count,
                share: total === 0 ? 0 : (count / total) * 100,
              },
            ]
          })
          .sort((a, b) => b.votes - a.votes || a.user.name.localeCompare(b.user.name))

        const top = tallies[0]?.votes ?? 0
        return {
          positionId: position.id,
          title: position.title,
          totalVotes: total,
          tallies,
          leaderIds:
            top === 0
              ? []
              : tallies.filter((t) => t.votes === top).map((t) => t.candidateId),
        }
      })

      return {
        election,
        totalVoters: new Set(electionVotes.map((v) => v.voterId)).size,
        eligibleVoters: users.filter((u) => u.role !== Role.ADMIN).length,
        positions,
      }
    })
    .sort(
      (a, b) =>
        Number(b.election.status === ElectionStatus.VOTING_OPEN) -
        Number(a.election.status === ElectionStatus.VOTING_OPEN)
    )
}
