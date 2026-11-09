"use client"

import { useState } from "react"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"

import { CandidateFormDialog } from "@/components/dashboard/admin/candidate-form-dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataBoundary } from "@/components/shared/data-boundary"
import { SectionHeader } from "@/components/shared/section-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Action, ApplicationStatus, Subject } from "@/constants/enums"
import { APPLICATION_STATUS_META } from "@/constants/labels"
import { Can } from "@/lib/acl/context"
import { formatDate } from "@/lib/format"
import { runWithToast } from "@/lib/notify"
import {
  useDeleteCandidateMutation,
  useGetCandidatesQuery,
  useUpdateCandidateMutation,
} from "@/store/services/candidates.api"
import type { CandidateDetails } from "@/types/election"

export function CandidatesPanel() {
  const { data: candidates = [], isLoading } = useGetCandidatesQuery()
  const [updateCandidate, { isLoading: updating }] = useUpdateCandidateMutation()
  const [deleteCandidate, { isLoading: deleting }] = useDeleteCandidateMutation()
  // `null` = closed, `"new"` = add dialog, otherwise the candidate being edited.
  const [editing, setEditing] = useState<CandidateDetails | "new" | null>(null)
  const [toDelete, setToDelete] = useState<CandidateDetails | null>(null)

  const screen = (candidate: CandidateDetails, status: ApplicationStatus) =>
    runWithToast(
      () => updateCandidate({ id: candidate.id, status }).unwrap(),
      `Candidate ${APPLICATION_STATUS_META[status].label.toLowerCase()}`
    )

  const confirmDelete = async () => {
    if (!toDelete) return
    const ok = await runWithToast(
      () => deleteCandidate(toDelete.id).unwrap(),
      "Candidate removed"
    )
    if (ok) setToDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Candidates"
        description="Screen applications and manage who is on the ballot."
        action={
          <Can I={Action.CREATE} a={Subject.CANDIDATE}>
            <Button onClick={() => setEditing("new")}>
              <Plus /> Add candidate
            </Button>
          </Can>
        }
      />

      <DataBoundary
        isLoading={isLoading}
        isEmpty={candidates.length === 0}
        emptyMessage="No candidates or applications yet."
      >
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Election</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="font-medium">{candidate.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {candidate.user.age} yrs · {candidate.user.membershipYears}{" "}
                      yrs member
                    </div>
                  </TableCell>
                  <TableCell>{candidate.electionTitle}</TableCell>
                  <TableCell>{candidate.positionTitle}</TableCell>
                  <TableCell>
                    <StatusBadge meta={APPLICATION_STATUS_META[candidate.status]} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(candidate.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Can I={Action.APPROVE} a={Subject.CANDIDATE}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Approve candidate"
                          disabled={
                            updating ||
                            candidate.status === ApplicationStatus.APPROVED
                          }
                          onClick={() => screen(candidate, ApplicationStatus.APPROVED)}
                        >
                          <Check />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Reject candidate"
                          disabled={
                            updating ||
                            candidate.status === ApplicationStatus.REJECTED
                          }
                          onClick={() => screen(candidate, ApplicationStatus.REJECTED)}
                        >
                          <X />
                        </Button>
                      </Can>
                      <Can I={Action.UPDATE} a={Subject.CANDIDATE}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit candidate"
                          onClick={() => setEditing(candidate)}
                        >
                          <Pencil />
                        </Button>
                      </Can>
                      <Can I={Action.DELETE} a={Subject.CANDIDATE}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete candidate"
                          onClick={() => setToDelete(candidate)}
                        >
                          <Trash2 />
                        </Button>
                      </Can>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DataBoundary>

      {editing && (
        <CandidateFormDialog
          candidate={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Remove candidate?"
        description={`${toDelete?.user.name} will be removed from ${toDelete?.positionTitle}.`}
        confirmLabel="Remove"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
