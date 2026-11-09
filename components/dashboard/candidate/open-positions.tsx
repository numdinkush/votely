"use client"

import { PositionCard } from "@/components/dashboard/candidate/position-card"
import { DataBoundary } from "@/components/shared/data-boundary"
import { SectionHeader } from "@/components/shared/section-header"
import { APPLICABLE_STATUSES } from "@/constants/app"
import { useAuthUser } from "@/hooks/use-current-user"
import { filterByStatus } from "@/lib/election"
import { useGetMyCandidaciesQuery } from "@/store/services/candidates.api"
import { useGetElectionsQuery } from "@/store/services/elections.api"

/** Positions the candidate can apply for, across elections accepting applications. */
export function OpenPositions() {
  const user = useAuthUser()
  const { data: elections = [], isLoading } = useGetElectionsQuery()
  const { data: mine = [] } = useGetMyCandidaciesQuery(user.id)

  const positions = filterByStatus(elections, APPLICABLE_STATUSES).flatMap(
    (election) => election.positions.map((position) => ({ election, position }))
  )

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Positions you can apply for"
        description="Check the criteria, then apply. An admin will screen your application."
      />
      <DataBoundary
        isLoading={isLoading}
        isEmpty={positions.length === 0}
        emptyMessage="No positions are open for applications right now."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {positions.map(({ election, position }) => (
            <PositionCard
              key={position.id}
              election={election}
              position={position}
              application={mine.find((c) => c.positionId === position.id)}
            />
          ))}
        </div>
      </DataBoundary>
    </div>
  )
}
