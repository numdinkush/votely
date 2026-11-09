import type { Metadata } from "next"

import { ElectionResults } from "@/components/dashboard/shared/election-results"

export const metadata: Metadata = { title: "Results | Votely" }

export default function ResultsPage() {
  return <ElectionResults />
}
