"use client"

import { useMemo, type ReactNode } from "react"
import {
  AbilityProvider as CaslAbilityProvider,
  Can as CaslCan,
  useAbility as useCaslAbility,
  type CanProps,
} from "@casl/react"

import { defineAbilityFor, type AppAbility } from "@/lib/acl/ability"
import { useAppSelector } from "@/store/hooks"

/** `<Can I={Action.CREATE} a={Subject.ELECTION}>...</Can>`, typed to our ability. */
export const Can = CaslCan as (props: CanProps<AppAbility>) => ReactNode

export const useAbility = () => useCaslAbility<AppAbility>()

/** Keeps the ability in sync with the signed-in user's role. */
export function AbilityProvider({ children }: { children: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user)
  const ability = useMemo(() => defineAbilityFor(user), [user])

  return <CaslAbilityProvider value={ability}>{children}</CaslAbilityProvider>
}
