import { ElectionStatus } from "@/constants/enums"

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ELECTIONS: "/elections",
  CANDIDATES: "/candidates",
  POSITIONS: "/positions",
  APPLICATIONS: "/applications",
  BALLOTS: "/ballots",
  RESULTS: "/results",
} as const

/** Price of the candidate nomination form (mock currency). */
export const CANDIDATE_FORM_PRICE = 25000

export const DEFAULT_CANDIDATES_REQUIRED = 1

/** Elections that members can currently vote in / apply to contest. */
export const VOTABLE_STATUSES = [ElectionStatus.VOTING_OPEN]
/** How often live results refresh while the page is open. */
export const RESULTS_POLL_INTERVAL_MS = 30_000

export const APPLICABLE_STATUSES = [ElectionStatus.APPLICATIONS_OPEN]
