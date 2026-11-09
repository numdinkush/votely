import { z } from "zod"

import { ApplicationStatus } from "@/constants/enums"

export const candidateSchema = z.object({
  userId: z.string().min(1, "Select a member"),
  electionId: z.string().min(1, "Select an election"),
  positionId: z.string().min(1, "Select a position"),
  status: z.enum(ApplicationStatus),
  note: z.string(),
})

export type CandidateFormValues = z.infer<typeof candidateSchema>
