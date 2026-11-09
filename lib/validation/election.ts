import { z } from "zod"

import { CriterionType, ElectionStatus } from "@/constants/enums"

const criterionSchema = z.object({
  type: z.enum(CriterionType),
  value: z.number({ error: "Required" }).min(0, "Must be 0 or more"),
})

const positionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Position title is required"),
  candidatesRequired: z
    .number({ error: "Required" })
    .int()
    .min(1, "At least 1 candidate"),
  criteria: z.array(criterionSchema),
})

export const electionSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    status: z.enum(ElectionStatus),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    positions: z.array(positionSchema).min(1, "Add at least one position"),
  })
  .refine((v) => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "End date must be after start date",
  })

export type ElectionFormValues = z.infer<typeof electionSchema>
