"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { PositionFields } from "@/components/dashboard/admin/position-fields"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DEFAULT_CANDIDATES_REQUIRED } from "@/constants/app"
import { ElectionStatus } from "@/constants/enums"
import { ELECTION_STATUS_META } from "@/constants/labels"
import { runWithToast } from "@/lib/notify"
import {
  electionSchema,
  type ElectionFormValues,
} from "@/lib/validation/election"
import {
  useCreateElectionMutation,
  useUpdateElectionMutation,
} from "@/store/services/elections.api"
import type { Election } from "@/types/election"

const STATUS_OPTIONS = optionsFromMeta(ELECTION_STATUS_META)

const EMPTY_VALUES: ElectionFormValues = {
  title: "",
  description: "",
  status: ElectionStatus.DRAFT,
  startDate: "",
  endDate: "",
  positions: [
    {
      title: "",
      candidatesRequired: DEFAULT_CANDIDATES_REQUIRED,
      criteria: [],
    },
  ],
}

interface ElectionFormDialogProps {
  /** Pass an election to edit; omit to create. */
  election?: Election
  onClose: () => void
}

/** Mount only while open so the form always starts from fresh values. */
export function ElectionFormDialog({ election, onClose }: ElectionFormDialogProps) {
  const [createElection, { isLoading: creating }] = useCreateElectionMutation()
  const [updateElection, { isLoading: updating }] = useUpdateElectionMutation()
  const saving = creating || updating

  const form = useForm<ElectionFormValues>({
    resolver: zodResolver(electionSchema),
    defaultValues: election ?? EMPTY_VALUES,
  })
  const { control, register, handleSubmit, formState } = form
  const { errors } = formState

  const onSubmit = async (values: ElectionFormValues) => {
    const positions = values.positions.map((p) => ({
      ...p,
      id: p.id ?? `positions_${Math.random().toString(36).slice(2, 9)}`,
    }))
    const payload = { ...values, positions }

    const ok = election
      ? await runWithToast(
          () => updateElection({ id: election.id, ...payload }).unwrap(),
          "Election updated"
        )
      : await runWithToast(
          () => createElection(payload).unwrap(),
          "Election created"
        )
    if (ok) onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{election ? "Edit election" : "Create election"}</DialogTitle>
          <DialogDescription>
            Set the schedule, positions and who is eligible to contest them.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  aria-invalid={!!errors.title}
                  {...register("title")}
                />
                <FieldError errors={[errors.title]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea id="description" rows={2} {...register("description")} />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel>Status</FieldLabel>
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
                <Field data-invalid={!!errors.startDate}>
                  <FieldLabel htmlFor="startDate">Start date</FieldLabel>
                  <Input
                    id="startDate"
                    type="date"
                    aria-invalid={!!errors.startDate}
                    {...register("startDate")}
                  />
                  <FieldError errors={[errors.startDate]} />
                </Field>
                <Field data-invalid={!!errors.endDate}>
                  <FieldLabel htmlFor="endDate">End date</FieldLabel>
                  <Input
                    id="endDate"
                    type="date"
                    aria-invalid={!!errors.endDate}
                    {...register("endDate")}
                  />
                  <FieldError errors={[errors.endDate]} />
                </Field>
              </div>

              <PositionFields />
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />}
                {election ? "Save changes" : "Create election"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
