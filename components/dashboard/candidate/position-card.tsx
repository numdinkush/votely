"use client"

import { Loader2 } from "lucide-react"

import { CriteriaList } from "@/components/dashboard/candidate/criteria-list"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Action, Subject } from "@/constants/enums"
import { APPLICATION_STATUS_META } from "@/constants/labels"
import { Can } from "@/lib/acl/context"
import { isEligible } from "@/lib/eligibility"
import { runWithToast } from "@/lib/notify"
import { useAuthUser } from "@/hooks/use-current-user"
import { useApplyForPositionMutation } from "@/store/services/candidates.api"
import type { CandidateDetails, Election, Position } from "@/types/election"

interface PositionCardProps {
  election: Election
  position: Position
  /** The user's existing application for this position, if any. */
  application?: CandidateDetails
}

export function PositionCard({ election, position, application }: PositionCardProps) {
  const user = useAuthUser()
  const [apply, { isLoading }] = useApplyForPositionMutation()
  const eligible = isEligible(user, position)

  const onApply = () =>
    runWithToast(
      () =>
        apply({
          userId: user.id,
          electionId: election.id,
          positionId: position.id,
        }).unwrap(),
      "Application submitted"
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{position.title}</CardTitle>
        <CardDescription>
          {election.title} · {position.candidatesRequired} candidate
          {position.candidatesRequired > 1 ? "s" : ""} required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium text-muted-foreground">Criteria</p>
        <CriteriaList user={user} position={position} />
      </CardContent>
      <CardFooter className="justify-between gap-3">
        {application ? (
          <>
            <span className="text-sm text-muted-foreground">Your application</span>
            <StatusBadge meta={APPLICATION_STATUS_META[application.status]} />
          </>
        ) : (
          <Can I={Action.APPLY} a={Subject.POSITION}>
            <span className="text-xs text-muted-foreground">
              {eligible ? "You meet all criteria" : "You do not meet all criteria"}
            </span>
            <Button disabled={!eligible || isLoading} onClick={onApply}>
              {isLoading && <Loader2 className="animate-spin" />}
              Apply
            </Button>
          </Can>
        )}
      </CardFooter>
    </Card>
  )
}
