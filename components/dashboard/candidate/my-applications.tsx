"use client"

import { DataBoundary } from "@/components/shared/data-boundary"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { APPLICATION_STATUS_META } from "@/constants/labels"
import { useAuthUser } from "@/hooks/use-current-user"
import { formatDate } from "@/lib/format"
import { useGetMyCandidaciesQuery } from "@/store/services/candidates.api"

export function MyApplications() {
  const user = useAuthUser()
  const { data: applications = [], isLoading } = useGetMyCandidaciesQuery(user.id)

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="My applications"
        description="Track the screening status of your candidacies."
      />
      <DataBoundary
        isLoading={isLoading}
        isEmpty={applications.length === 0}
        emptyMessage="You have not applied for any position yet."
      >
        <div className="flex flex-col gap-3">
          {applications.map((application) => (
            <Card key={application.id} size="sm">
              <CardContent className="flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{application.positionTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {application.electionTitle} · applied{" "}
                    {formatDate(application.createdAt)}
                  </p>
                  {application.note && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Note: {application.note}
                    </p>
                  )}
                </div>
                <StatusBadge meta={APPLICATION_STATUS_META[application.status]} />
              </CardContent>
            </Card>
          ))}
        </div>
      </DataBoundary>
    </div>
  )
}
