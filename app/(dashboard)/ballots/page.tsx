import type { Metadata } from "next"

import { ElectionsToVote } from "@/components/dashboard/shared/elections-to-vote"

export const metadata: Metadata = { title: "Vote | Votely" }

export default function BallotsPage() {
  return <ElectionsToVote />
}
