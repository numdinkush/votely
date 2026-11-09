import { Action, Role, Subject } from "@/constants/enums"

export interface Permission {
  action: Action
  subject: Subject
}

const permissions = (actions: Action[], subjects: Subject[]): Permission[] =>
  subjects.flatMap((subject) => actions.map((action) => ({ action, subject })))

const CRUD = [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE]

/** Everything a voter can do; shared by every role that votes. */
const VOTER_BASE: Permission[] = permissions(
  [Action.READ, Action.VOTE],
  [Subject.ELECTION]
)

/** Single source of truth for what each role may do. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.VOTER]: [
    ...VOTER_BASE,
    { action: Action.PURCHASE, subject: Subject.CANDIDATE_FORM },
  ],
  [Role.CANDIDATE]: [
    ...VOTER_BASE,
    ...permissions([Action.READ, Action.APPLY], [Subject.POSITION]),
  ],
  [Role.ADMIN]: [
    ...permissions(CRUD, [Subject.ELECTION, Subject.POSITION, Subject.CANDIDATE]),
    { action: Action.APPROVE, subject: Subject.CANDIDATE },
  ],
}
