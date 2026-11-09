"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ApplicationStatus } from "@/constants/enums"
import { useAuthUser } from "@/hooks/use-current-user"
import { getInitials } from "@/lib/format"
import { runWithToast } from "@/lib/notify"
import { useGetCandidatesQuery } from "@/store/services/candidates.api"
import { useCastBallotMutation } from "@/store/services/votes.api"
import type { Election } from "@/types/election"
import { cn } from "cn"

interface BallotDialogProps {
  election: Election
  onClose: () => void
}

/** Mount only while open so the ballot always starts blank. */
export function BallotDialog({ election, onClose }: BallotDialogProps) {
  const user = useAuthUser()
  const { data: candidates = [], isLoading } = useGetCandidatesQuery()
  const [castBallot, { isLoading: submitting }] = useCastBallotMutation()
  /** positionId -> candidateId */
  const [selections, setSelections] = useState<Record<string, string>>({})

  const approved = candidates.filter(
    (c) =>
      c.electionId === election.id && c.status === ApplicationStatus.APPROVED
  )
  const picked = Object.keys(selections).length

  const toggle = (positionId: string, candidateId: string) =>
    setSelections((current) => {
      const next = { ...current }
      if (next[positionId] === candidateId) delete next[positionId]
      else next[positionId] = candidateId
      return next
    })

  const onSubmit = async () => {
    const ok = await runWithToast(
      () =>
        castBallot({
          userId: user.id,
          electionId: election.id,
          selections,
        }).unwrap(),
      "Your vote has been recorded"
    )
    if (ok) onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !submitting && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{election.title}</DialogTitle>
          <DialogDescription>
            Pick one candidate per position. You can skip a position. Votes
            cannot be changed once submitted.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {election.positions.map((position) => {
              const options = approved.filter(
                (c) => c.positionId === position.id
              )
              return (
                <fieldset key={position.id} className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-semibold">
                    {position.title}
                  </legend>
                  {options.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                      No approved candidates for this position.
                    </p>
                  ) : (
                    <div role="radiogroup" className="flex flex-col gap-2">
                      {options.map((candidate) => {
                        const selected =
                          selections[position.id] === candidate.id
                        return (
                          <button
                            key={candidate.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            disabled={submitting}
                            onClick={() => toggle(position.id, candidate.id)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
                              selected && "border-primary bg-primary/5"
                            )}
                          >
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(candidate.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {candidate.user.name}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {candidate.user.membershipYears} yrs member
                              </span>
                            </span>
                            <span
                              className={cn(
                                "grid size-5 shrink-0 place-items-center rounded-full border",
                                selected &&
                                  "border-primary bg-primary text-primary-foreground"
                              )}
                            >
                              {selected && <Check className="size-3" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </fieldset>
              )
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={picked === 0 || submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            Submit vote{picked > 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
