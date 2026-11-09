"use client"

import { CalendarDays, Trophy, Users } from "lucide-react"
import { cn } from "cn"

import { DataBoundary } from "@/components/shared/data-boundary"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RESULTS_POLL_INTERVAL_MS } from "@/constants/app"
import { ElectionStatus } from "@/constants/enums"
import { ELECTION_STATUS_META } from "@/constants/labels"
import { useAuthUser } from "@/hooks/use-current-user"
import { formatDate, getInitials } from "@/lib/format"
import {
  useGetMyVotesQuery,
  useGetResultsQuery,
} from "@/store/services/votes.api"
import type { ElectionResult, PositionResult } from "@/types/election"

/** Live tallies for open elections and final results for closed ones. */
export function ElectionResults() {
  const user = useAuthUser()
  const { data: results = [], isLoading } = useGetResultsQuery(undefined, {
    pollingInterval: RESULTS_POLL_INTERVAL_MS,
  })
  const { data: myVotes = [] } = useGetMyVotesQuery(user.id)
  const myCandidateIds = new Set(myVotes.map((v) => v.candidateId))

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Election results"
        description="Live tallies while voting is open, final results once an election closes."
      />
      <DataBoundary
        isLoading={isLoading}
        isEmpty={results.length === 0}
        emptyMessage="No results yet. Results appear once voting opens."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {results.map((result) => (
            <ResultCard
              key={result.election.id}
              result={result}
              myCandidateIds={myCandidateIds}
            />
          ))}
        </div>
      </DataBoundary>
    </div>
  )
}

function ResultCard({
  result,
  myCandidateIds,
}: {
  result: ElectionResult
  myCandidateIds: Set<string>
}) {
  const { election, positions, totalVoters, eligibleVoters } = result
  const final = election.status === ElectionStatus.CLOSED
  const turnout =
    eligibleVoters === 0 ? 0 : Math.round((totalVoters / eligibleVoters) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{election.title}</CardTitle>
          <StatusBadge meta={ELECTION_STATUS_META[election.status]} />
        </div>
        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(election.startDate)} - {formatDate(election.endDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {totalVoters} of {eligibleVoters} members voted
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Turnout</span>
            <span className="tabular-nums">{turnout}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Voter turnout"
            aria-valuenow={turnout}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${turnout}%` }}
            />
          </div>
        </div>
        {positions.map((position) => (
          <PositionTally
            key={position.positionId}
            position={position}
            final={final}
            myCandidateIds={myCandidateIds}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function PositionTally({
  position,
  final,
  myCandidateIds,
}: {
  position: PositionResult
  final: boolean
  myCandidateIds: Set<string>
}) {
  const tied = position.leaderIds.length > 1
  const uncontested = position.tallies.length === 1
  const leaderLabel = tied
    ? "Tied"
    : uncontested
      ? "Uncontested"
      : final
        ? "Elected"
        : "Leading"

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{position.title}</h3>
        <span className="text-xs text-muted-foreground">
          {position.totalVotes} {position.totalVotes === 1 ? "vote" : "votes"}
        </span>
      </div>

      {position.tallies.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No approved candidates for this position.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {position.tallies.map((tally) => {
            const leader = position.leaderIds.includes(tally.candidateId)
            return (
              <li key={tally.candidateId} className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{getInitials(tally.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {tally.user.name}
                      </span>
                      {leader && (
                        <Badge variant="default">
                          <Trophy className="size-3" />
                          {leaderLabel}
                        </Badge>
                      )}
                      {myCandidateIds.has(tally.candidateId) && (
                        <Badge variant="outline">Your vote</Badge>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {tally.votes} · {Math.round(tally.share)}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${tally.user.name} vote share`}
                    aria-valuenow={Math.round(tally.share)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        leader ? "bg-primary" : "bg-primary/40"
                      )}
                      style={{ width: `${tally.share}%` }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
