"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"

import {
  OptionSelect,
  optionsFromMeta,
} from "@/components/shared/option-select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ApplicationStatus, Role } from "@/constants/enums"
import { APPLICATION_STATUS_META } from "@/constants/labels"
import { runWithToast } from "@/lib/notify"
import {
  candidateSchema,
  type CandidateFormValues,
} from "@/lib/validation/candidate"
import {
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
} from "@/store/services/candidates.api"
import { useGetElectionsQuery } from "@/store/services/elections.api"
import { useGetUsersQuery } from "@/store/services/users.api"
import type { CandidateDetails } from "@/types/election"

const STATUS_OPTIONS = optionsFromMeta(APPLICATION_STATUS_META)

const EMPTY_VALUES: CandidateFormValues = {
  userId: "",
  electionId: "",
  positionId: "",
  status: ApplicationStatus.APPROVED,
  note: "",
}

interface CandidateFormDialogProps {
  /** Pass a candidate to edit; omit to create. */
  candidate?: CandidateDetails
  onClose: () => void
}

/** Mount only while open so the form always starts from fresh values. */
export function CandidateFormDialog({
  candidate,
  onClose,
}: CandidateFormDialogProps) {
  const { data: users = [] } = useGetUsersQuery()
  const { data: elections = [] } = useGetElectionsQuery()
  const [createCandidate, { isLoading: creating }] = useCreateCandidateMutation()
  const [updateCandidate, { isLoading: updating }] = useUpdateCandidateMutation()
  const saving = creating || updating

  const { control, register, handleSubmit, setValue, formState } =
    useForm<CandidateFormValues>({
      resolver: zodResolver(candidateSchema),
      defaultValues: candidate ?? EMPTY_VALUES,
    })
  const { errors } = formState
  const electionId = useWatch({ control, name: "electionId" })

  const userOptions = users
    .filter((u) => u.role !== Role.ADMIN)
    .map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))
  const electionOptions = elections.map((e) => ({ value: e.id, label: e.title }))
  const positionOptions = (
    elections.find((e) => e.id === electionId)?.positions ?? []
  ).map((p) => ({ value: p.id, label: p.title }))

  const onSubmit = async (values: CandidateFormValues) => {
    const ok = candidate
      ? await runWithToast(
          () => updateCandidate({ id: candidate.id, ...values }).unwrap(),
          "Candidate updated"
        )
      : await runWithToast(
          () => createCandidate(values).unwrap(),
          "Candidate added"
        )
    if (ok) onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{candidate ? "Edit candidate" : "Add candidate"}</DialogTitle>
          <DialogDescription>
            Assign a member to a position and set their screening status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.userId}>
              <FieldLabel>Member</FieldLabel>
              <Controller
                control={control}
                name="userId"
                render={({ field }) => (
                  <OptionSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={userOptions}
                    placeholder="Select a member"
                    invalid={!!errors.userId}
                  />
                )}
              />
              <FieldError errors={[errors.userId]} />
            </Field>

            <Field data-invalid={!!errors.electionId}>
              <FieldLabel>Election</FieldLabel>
              <Controller
                control={control}
                name="electionId"
                render={({ field }) => (
                  <OptionSelect
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v)
                      setValue("positionId", "")
                    }}
                    options={electionOptions}
                    placeholder="Select an election"
                    invalid={!!errors.electionId}
                  />
                )}
              />
              <FieldError errors={[errors.electionId]} />
            </Field>

            <Field data-invalid={!!errors.positionId}>
              <FieldLabel>Position</FieldLabel>
              <Controller
                control={control}
                name="positionId"
                render={({ field }) => (
                  <OptionSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={positionOptions}
                    placeholder="Select a position"
                    disabled={!electionId}
                    invalid={!!errors.positionId}
                  />
                )}
              />
              <FieldError errors={[errors.positionId]} />
            </Field>

            <Field>
              <FieldLabel>Screening status</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <OptionSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={STATUS_OPTIONS}
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="note">Review note</FieldLabel>
              <Textarea id="note" rows={2} {...register("note")} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {candidate ? "Save changes" : "Add candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
