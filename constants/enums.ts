export enum Role {
  ADMIN = "admin",
  VOTER = "voter",
  CANDIDATE = "candidate",
}

export enum ElectionStatus {
  DRAFT = "draft",
  APPLICATIONS_OPEN = "applications_open",
  VOTING_OPEN = "voting_open",
  CLOSED = "closed",
}

export enum ApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum CriterionType {
  MIN_AGE = "min_age",
  MIN_MEMBERSHIP_YEARS = "min_membership_years",
}

/** ACL actions. */
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
  APPLY = "apply",
  VOTE = "vote",
  PURCHASE = "purchase",
}

/** ACL subjects. */
export enum Subject {
  ELECTION = "Election",
  POSITION = "Position",
  CANDIDATE = "Candidate",
  CANDIDATE_FORM = "CandidateForm",
}
