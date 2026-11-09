"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Option<T extends string = string> {
  value: T
  label: string
}

interface OptionSelectProps<T extends string> {
  value: T | ""
  onChange: (value: T) => void
  options: Option<T>[]
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  id?: string
}

/** Thin wrapper over shadcn Select that takes a plain options array. */
export function OptionSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled,
  invalid,
  id,
}: OptionSelectProps<T>) {
  return (
    <Select
      value={value || null}
      items={options}
      onValueChange={(v) => v && onChange(v as T)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Builds options from an enum-keyed status map. */
export const optionsFromMeta = <T extends string>(
  meta: Record<T, { label: string }>
): Option<T>[] =>
  (Object.keys(meta) as T[]).map((value) => ({
    value,
    label: meta[value].label,
  }))

/** Builds options from an enum-keyed label map. */
export const optionsFromLabels = <T extends string>(
  labels: Record<T, string>
): Option<T>[] =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }))
