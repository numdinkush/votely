import type { Vote } from "@/types/election"

/**
 * Seed ballots so results are not empty on first load.
 * The demo voter/candidate accounts have NOT voted yet, so they can cast a ballot.
 */
const vote = (
  n: number,
  voterId: string,
  electionId: string,
  positionId: string,
  candidateId: string
): Vote => ({
  id: `votes_seed_${n}`,
  voterId,
  electionId,
  positionId,
  candidateId,
  createdAt: "2026-11-05T12:00:00.000Z",
})

export const SEED_VOTES: Vote[] = [
  // Budget Committee - Treasurer (candidates_2, candidates_8, candidates_9)
  vote(1, "users_wale", "elections_budget", "positions_treasurer", "candidates_8"),
  vote(2, "users_zainab", "elections_budget", "positions_treasurer", "candidates_8"),
  vote(3, "users_amara", "elections_budget", "positions_treasurer", "candidates_9"),
  vote(4, "users_ngozi", "elections_budget", "positions_treasurer", "candidates_2"),

  // Audit Committee - Auditor (candidates_10, candidates_11, candidates_12)
  vote(5, "users_wale", "elections_audit", "positions_auditor", "candidates_11"),
  vote(6, "users_zainab", "elections_audit", "positions_auditor", "candidates_10"),
  vote(7, "users_david", "elections_audit", "positions_auditor", "candidates_11"),

  // Disciplinary Committee - closed (candidates_20, candidates_21, candidates_22)
  vote(8, "users_wale", "elections_disciplinary", "positions_disciplinary", "candidates_21"),
  vote(9, "users_zainab", "elections_disciplinary", "positions_disciplinary", "candidates_21"),
  vote(10, "users_voter", "elections_disciplinary", "positions_disciplinary", "candidates_20"),
  vote(11, "users_candidate", "elections_disciplinary", "positions_disciplinary", "candidates_21"),
  vote(12, "users_david", "elections_disciplinary", "positions_disciplinary", "candidates_22"),
  vote(13, "users_samuel", "elections_disciplinary", "positions_disciplinary", "candidates_20"),
  vote(14, "users_emeka", "elections_disciplinary", "positions_disciplinary", "candidates_21"),
]
