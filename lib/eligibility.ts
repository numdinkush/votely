import { CriterionType } from "@/constants/enums"
import type { User } from "@/types/auth"
import type { Criterion, Position } from "@/types/election"

type Evaluator = (user: User, required: number) => boolean

/** How each criterion type is checked against a user's profile. */
const EVALUATORS: Record<CriterionType, Evaluator> = {
  [CriterionType.MIN_AGE]: (user, required) => user.age >= required,
  [CriterionType.MIN_MEMBERSHIP_YEARS]: (user, required) =>
    user.membershipYears >= required,
}

export const meetsCriterion = (user: User, { type, value }: Criterion) =>
  EVALUATORS[type](user, value)

export const unmetCriteria = (user: User, position: Position) =>
  position.criteria.filter((criterion) => !meetsCriterion(user, criterion))

export const isEligible = (user: User, position: Position) =>
  unmetCriteria(user, position).length === 0
