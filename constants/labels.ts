import {
  ApplicationStatus,
  CriterionType,
  ElectionStatus,
  Role,
} from "@/constants/enums"

export type BadgeTone = "default" | "secondary" | "outline" | "destructive"

export interface StatusMeta {
  label: string
  tone: BadgeTone
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.VOTER]: "Voter",
  [Role.CANDIDATE]: "Candidate",
}

export const ROLE_DASHBOARD_HEADINGS: Record<
  Role,
  { title: string; subtitle: string }
> = {
  [Role.ADMIN]: {
    title: "Election administration",
    subtitle: "Manage elections, positions, criteria and candidate screening.",
  },
  [Role.CANDIDATE]: {
    title: "Candidate dashboard",
    subtitle: "Find positions you qualify for and track your applications.",
  },
  [Role.VOTER]: {
    title: "Voter dashboard",
    subtitle: "See the elections you can take part in.",
  },
}

export const ELECTION_STATUS_META: Record<ElectionStatus, StatusMeta> = {
  [ElectionStatus.DRAFT]: { label: "Draft", tone: "outline" },
  [ElectionStatus.APPLICATIONS_OPEN]: {
    label: "Applications open",
    tone: "secondary",
  },
  [ElectionStatus.VOTING_OPEN]: { label: "Voting open", tone: "default" },
  [ElectionStatus.CLOSED]: { label: "Closed", tone: "outline" },
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  [ApplicationStatus.PENDING]: { label: "Pending", tone: "secondary" },
  [ApplicationStatus.APPROVED]: { label: "Approved", tone: "default" },
  [ApplicationStatus.REJECTED]: { label: "Rejected", tone: "destructive" },
}

export const CRITERION_LABELS: Record<CriterionType, string> = {
  [CriterionType.MIN_AGE]: "Minimum age",
  [CriterionType.MIN_MEMBERSHIP_YEARS]: "Minimum years of membership",
}
