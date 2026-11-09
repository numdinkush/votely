"use client"

import { Award, CalendarClock, Vote } from "lucide-react"

import { ElectionsToVote } from "@/components/dashboard/shared/elections-to-vote"
import { StatGrid } from "@/components/dashboard/shared/stat-card"
import { BecomeCandidateCard } from "@/components/dashboard/voter/become-candidate-card"
import { APPLICABLE_STATUSES, VOTABLE_STATUSES } from "@/constants/app"
import { useAuthUser } from "@/hooks/use-current-user"
import { filterByStatus } from "@/lib/election"
import { useGetElectionsQuery } from "@/store/services/elections.api"

export function VoterOverview() {
  const user = useAuthUser()
  const { data: elections = [] } = useGetElectionsQuery()

  return (
    <div className="flex flex-col gap-8">
      <BecomeCandidateCard />
      <StatGrid
        stats={[
          {
            label: "Open for voting",
            value: filterByStatus(elections, VOTABLE_STATUSES).length,
            icon: Vote,
          },
          {
            label: "Accepting nominations",
            value: filterByStatus(elections, APPLICABLE_STATUSES).length,
            icon: CalendarClock,
          },
          {
            label: "Years of membership",
            value: user.membershipYears,
            icon: Award,
          },
        ]}
      />
      <ElectionsToVote />
    </div>
  )
}
