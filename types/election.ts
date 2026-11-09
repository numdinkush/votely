import type {
  ApplicationStatus,
  CriterionType,
  ElectionStatus,
} from "@/constants/enums"
import type { User } from "@/types/auth"

export interface Criterion {
  type: CriterionType
  value: number
}

export interface Position {
  id: string
  title: string
  /** Number of candidates required to contest this position. */
  candidatesRequired: number
  criteria: Criterion[]
}

export interface Election {
  id: string
  title: string
  description: string
  status: ElectionStatus
  startDate: string
  endDate: string
  positions: Position[]
}

export type ElectionInput = Omit<Election, "id">

export interface Candidate {
  id: string
  userId: string
  electionId: string
  positionId: string
  status: ApplicationStatus
  note: string
  createdAt: string
}

export type CandidateInput = Omit<Candidate, "id" | "createdAt">

/** A single vote: one voter's choice for one position. */
export interface Vote {
  id: string
  electionId: string
  positionId: string
  /** The `Candidate` record (application) being voted for. */
  candidateId: string
  voterId: string
  createdAt: string
}

/** A voter's ballot: the chosen candidate per position (omitted = abstain). */
export interface BallotInput {
  userId: string
  electionId: string
  /** positionId -> candidateId */
  selections: Record<string, string>
}

export interface CandidateTally {
  candidateId: string
  user: User
  votes: number
  /** Percentage (0-100) of the votes cast for the position. */
  share: number
}

export interface PositionResult {
  positionId: string
  title: string
  totalVotes: number
  /** Sorted by votes, highest first. */
  tallies: CandidateTally[]
  /** Candidates holding the top (non-zero) vote count; more than one means a tie. */
  leaderIds: string[]
}

export interface ElectionResult {
  election: Election
  /** Distinct members who cast a ballot. */
  totalVoters: number
  /** Members allowed to vote (everyone except admins). */
  eligibleVoters: number
  positions: PositionResult[]
}

/** Candidate joined with display data. */
export interface CandidateDetails extends Candidate {
  user: User
  electionTitle: string
  positionTitle: string
}
