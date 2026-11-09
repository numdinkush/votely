"use client"

import Link from "next/link"
import { useState } from "react"
import { CircleCheck, Vote } from "lucide-react"

import { BallotDialog } from "@/components/dashboard/shared/ballot-dialog"
import { ElectionCard } from "@/components/dashboard/shared/election-card"
import { DataBoundary } from "@/components/shared/data-boundary"
import { SectionHeader } from "@/components/shared/section-header"
import { Button } from "@/components/ui/button"
import { ROUTES, VOTABLE_STATUSES } from "@/constants/app"
import { Action, Subject } from "@/constants/enums"
import { useAuthUser } from "@/hooks/use-current-user"
import { Can } from "@/lib/acl/context"
import { filterByStatus } from "@/lib/election"
import { useGetElectionsQuery } from "@/store/services/elections.api"
import { useGetMyVotesQuery } from "@/store/services/votes.api"
import type { Election } from "@/types/election"

/** Elections a member can currently take part in (shared by voter + candidate). */
export function ElectionsToVote() {
  const user = useAuthUser()
  const { data: elections = [], isLoading } = useGetElectionsQuery()
  const { data: myVotes = [], isLoading: loadingVotes } = useGetMyVotesQuery(
    user.id
  )
  const [ballotFor, setBallotFor] = useState<Election | null>(null)
  const votable = filterByStatus(elections, VOTABLE_STATUSES)
  const hasVoted = (electionId: string) =>
    myVotes.some((v) => v.electionId === electionId)

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Elections you can vote in"
        description="Open elections you are eligible to take part in."
        action={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={ROUTES.RESULTS} />}
          >
            View results
          </Button>
        }
      />
      <DataBoundary
        isLoading={isLoading || loadingVotes}
        isEmpty={votable.length === 0}
        emptyMessage="No elections are open for voting right now."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {votable.map((election) => (
            <ElectionCard
              key={election.id}
              election={election}
              footer={
                <Can I={Action.VOTE} a={Subject.ELECTION}>
                  {hasVoted(election.id) ? (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CircleCheck className="size-4 text-primary" />
                        You have voted
                      </span>
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href={ROUTES.RESULTS} />}
                      >
                        See results
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setBallotFor(election)}>
                      <Vote /> Cast vote
                    </Button>
                  )}
                </Can>
              }
            />
          ))}
        </div>
      </DataBoundary>

      {ballotFor && (
        <BallotDialog election={ballotFor} onClose={() => setBallotFor(null)} />
      )}
    </div>
  )
}
