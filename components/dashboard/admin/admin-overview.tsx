"use client"

import Link from "next/link"
import { CalendarCheck, CircleCheck, Hourglass, Vote } from "lucide-react"

import { StatGrid } from "@/components/dashboard/shared/stat-card"
import { DataBoundary } from "@/components/shared/data-boundary"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VOTABLE_STATUSES } from "@/constants/app"
import { ApplicationStatus } from "@/constants/enums"
import { ROUTES } from "@/constants/app"
import { APPLICATION_STATUS_META } from "@/constants/labels"
import { filterByStatus } from "@/lib/election"
import { useGetCandidatesQuery } from "@/store/services/candidates.api"
import { useGetElectionsQuery } from "@/store/services/elections.api"

export function AdminOverview() {
  const { data: elections = [] } = useGetElectionsQuery()
  const { data: candidates = [], isLoading } = useGetCandidatesQuery()

  const pending = candidates.filter((c) => c.status === ApplicationStatus.PENDING)
  const approved = candidates.filter((c) => c.status === ApplicationStatus.APPROVED)

  return (
    <div className="flex flex-col gap-8">
      <StatGrid
        stats={[
          { label: "Total elections", value: elections.length, icon: CalendarCheck },
          {
            label: "Voting open",
            value: filterByStatus(elections, VOTABLE_STATUSES).length,
            icon: Vote,
          },
          { label: "Awaiting screening", value: pending.length, icon: Hourglass },
          { label: "Approved candidates", value: approved.length, icon: CircleCheck },
        ]}
      />

      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Needs screening"
          description="Applications waiting for your decision."
          action={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={ROUTES.CANDIDATES} />}
            >
              Review all
            </Button>
          }
        />
        <DataBoundary
          isLoading={isLoading}
          isEmpty={pending.length === 0}
          emptyMessage="You're all caught up. No applications are pending."
        >
          <div className="flex flex-col gap-3">
            {pending.slice(0, 5).map((candidate) => (
              <Card key={candidate.id} size="sm">
                <CardContent className="flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{candidate.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {candidate.positionTitle} · {candidate.electionTitle}
                    </p>
                  </div>
                  <StatusBadge meta={APPLICATION_STATUS_META[candidate.status]} />
                </CardContent>
              </Card>
            ))}
          </div>
        </DataBoundary>
      </div>
    </div>
  )
}
