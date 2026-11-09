"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { ElectionFormDialog } from "@/components/dashboard/admin/election-form-dialog"
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
import { Action, Subject } from "@/constants/enums"
import { ELECTION_STATUS_META } from "@/constants/labels"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/acl/context"
import { runWithToast } from "@/lib/notify"
import {
  useDeleteElectionMutation,
  useGetElectionsQuery,
} from "@/store/services/elections.api"
import type { Election } from "@/types/election"

export function ElectionsPanel() {
  const { data: elections = [], isLoading } = useGetElectionsQuery()
  const [deleteElection, { isLoading: deleting }] = useDeleteElectionMutation()
  // `null` = closed, `"new"` = create dialog, otherwise the election being edited.
  const [editing, setEditing] = useState<Election | "new" | null>(null)
  const [toDelete, setToDelete] = useState<Election | null>(null)

  const confirmDelete = async () => {
    if (!toDelete) return
    const ok = await runWithToast(
      () => deleteElection(toDelete.id).unwrap(),
      "Election deleted"
    )
    if (ok) setToDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Elections"
        description="Create elections, define positions and set candidacy criteria."
        action={
          <Can I={Action.CREATE} a={Subject.ELECTION}>
            <Button onClick={() => setEditing("new")}>
              <Plus /> New election
            </Button>
          </Can>
        }
      />

      <DataBoundary
        isLoading={isLoading}
        isEmpty={elections.length === 0}
        emptyMessage="No elections yet. Create your first one."
      >
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Voting window</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.map((election) => (
                <TableRow key={election.id}>
                  <TableCell>
                    <div className="font-medium">{election.title}</div>
                    <div className="max-w-xs truncate text-xs text-muted-foreground">
                      {election.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge meta={ELECTION_STATUS_META[election.status]} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(election.startDate)} -{" "}
                    {formatDate(election.endDate)}
                  </TableCell>
                  <TableCell>
                    {election.positions.map((p) => p.title).join(", ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Can I={Action.UPDATE} a={Subject.ELECTION}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit election"
                          onClick={() => setEditing(election)}
                        >
                          <Pencil />
                        </Button>
                      </Can>
                      <Can I={Action.DELETE} a={Subject.ELECTION}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete election"
                          onClick={() => setToDelete(election)}
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
        <ElectionFormDialog
          election={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete election?"
        description={`"${toDelete?.title}" and all its candidates will be permanently removed.`}
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
