"use client"

import type { ComponentType } from "react"

import { AdminOverview } from "@/components/dashboard/admin/admin-overview"
import { CandidateOverview } from "@/components/dashboard/candidate/candidate-overview"
import { VoterOverview } from "@/components/dashboard/voter/voter-overview"
import { Role } from "@/constants/enums"
import { ROLE_DASHBOARD_HEADINGS } from "@/constants/labels"
import { useAuthUser } from "@/hooks/use-current-user"

/** Which overview each role lands on. */
const ROLE_VIEWS: Record<Role, ComponentType> = {
  [Role.ADMIN]: AdminOverview,
  [Role.CANDIDATE]: CandidateOverview,
  [Role.VOTER]: VoterOverview,
}

export function DashboardView() {
  const { role } = useAuthUser()
  const View = ROLE_VIEWS[role]
  const { title, subtitle } = ROLE_DASHBOARD_HEADINGS[role]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <View />
    </div>
  )
}
