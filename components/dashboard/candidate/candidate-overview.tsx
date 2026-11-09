"use client"

import { Briefcase, CircleCheck, ClipboardList, Hourglass } from "lucide-react"

import { MyApplications } from "@/components/dashboard/candidate/my-applications"
import { StatGrid } from "@/components/dashboard/shared/stat-card"
import { APPLICABLE_STATUSES } from "@/constants/app"
import { ApplicationStatus } from "@/constants/enums"
import { useAuthUser } from "@/hooks/use-current-user"
import { countPositions, filterByStatus } from "@/lib/election"
import { useGetMyCandidaciesQuery } from "@/store/services/candidates.api"
import { useGetElectionsQuery } from "@/store/services/elections.api"

export function CandidateOverview() {
  const user = useAuthUser()
  const { data: elections = [] } = useGetElectionsQuery()
  const { data: mine = [] } = useGetMyCandidaciesQuery(user.id)

  const count = (status: ApplicationStatus) =>
    mine.filter((c) => c.status === status).length

  return (
    <div className="flex flex-col gap-8">
      <StatGrid
        stats={[
          {
            label: "Positions open",
            value: countPositions(filterByStatus(elections, APPLICABLE_STATUSES)),
            icon: Briefcase,
          },
          { label: "My applications", value: mine.length, icon: ClipboardList },
          {
            label: "Pending",
            value: count(ApplicationStatus.PENDING),
            icon: Hourglass,
          },
          {
            label: "Approved",
            value: count(ApplicationStatus.APPROVED),
            icon: CircleCheck,
          },
        ]}
      />
      <MyApplications />
    </div>
  )
}
