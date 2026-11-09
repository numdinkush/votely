import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability"

import type { Action, Subject } from "@/constants/enums"
import { ROLE_PERMISSIONS } from "@/constants/permissions"
import type { User } from "@/types/auth"

export type AppAbility = MongoAbility<[Action, Subject]>

/** Builds a CASL ability from the user's role; no user means no permissions. */
export function defineAbilityFor(user: User | null): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (user) {
    ROLE_PERMISSIONS[user.role].forEach(({ action, subject }) =>
      can(action, subject)
    )
  }

  return build()
}
