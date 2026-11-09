"use client"

import { Plus, X } from "lucide-react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import {
  OptionSelect,
  optionsFromLabels,
} from "@/components/shared/option-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CriterionType } from "@/constants/enums"
import { CRITERION_LABELS } from "@/constants/labels"
import type { ElectionFormValues } from "@/lib/validation/election"

const CRITERION_OPTIONS = optionsFromLabels(CRITERION_LABELS)

/** Eligibility criteria editor for a single position. */
export function CriteriaFields({ positionIndex }: { positionIndex: number }) {
  const { control, register } = useFormContext<ElectionFormValues>()
  const name = `positions.${positionIndex}.criteria` as const
  const { fields, append, remove } = useFieldArray({ control, name })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Criteria for candidates
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => append({ type: CriterionType.MIN_AGE, value: 18 })}
        >
          <Plus /> Add criterion
        </Button>
      </div>
      {fields.map((field, i) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            control={control}
            name={`${name}.${i}.type`}
            render={({ field: f }) => (
              <OptionSelect
                value={f.value}
                onChange={f.onChange}
                options={CRITERION_OPTIONS}
              />
            )}
          />
          <Input
            type="number"
            className="w-24"
            {...register(`${name}.${i}.value`, { valueAsNumber: true })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove criterion"
            onClick={() => remove(i)}
          >
            <X />
          </Button>
        </div>
      ))}
    </div>
  )
}
