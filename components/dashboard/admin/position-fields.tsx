"use client"

import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { CriteriaFields } from "@/components/dashboard/admin/criteria-fields"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DEFAULT_CANDIDATES_REQUIRED } from "@/constants/app"
import type { ElectionFormValues } from "@/lib/validation/election"

/** Positions editor: title, candidates required and criteria per position. */
export function PositionFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ElectionFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Positions</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              title: "",
              candidatesRequired: DEFAULT_CANDIDATES_REQUIRED,
              criteria: [],
            })
          }
        >
          <Plus /> Add position
        </Button>
      </div>
      <FieldError errors={[errors.positions?.root]} />

      {fields.map((field, i) => {
        const positionErrors = errors.positions?.[i]
        return (
          <div
            key={field.id}
            className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3"
          >
            <div className="flex items-start gap-2">
              <Field data-invalid={!!positionErrors?.title} className="flex-1">
                <FieldLabel htmlFor={`position-title-${i}`}>Title</FieldLabel>
                <Input
                  id={`position-title-${i}`}
                  placeholder="e.g. Chairperson"
                  aria-invalid={!!positionErrors?.title}
                  {...register(`positions.${i}.title`)}
                />
                <FieldError errors={[positionErrors?.title]} />
              </Field>
              <Field
                data-invalid={!!positionErrors?.candidatesRequired}
                className="w-32"
              >
                <FieldLabel htmlFor={`position-count-${i}`}>
                  Candidates
                </FieldLabel>
                <Input
                  id={`position-count-${i}`}
                  type="number"
                  min={1}
                  aria-invalid={!!positionErrors?.candidatesRequired}
                  {...register(`positions.${i}.candidatesRequired`, {
                    valueAsNumber: true,
                  })}
                />
                <FieldError errors={[positionErrors?.candidatesRequired]} />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6"
                aria-label="Remove position"
                onClick={() => remove(i)}
              >
                <Trash2 />
              </Button>
            </div>
            <CriteriaFields positionIndex={i} />
          </div>
        )
      })}
    </div>
  )
}
