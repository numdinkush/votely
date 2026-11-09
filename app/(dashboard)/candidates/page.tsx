import type { Metadata } from "next"

import { CandidatesPanel } from "@/components/dashboard/admin/candidates-panel"

export const metadata: Metadata = { title: "Candidates | Votely" }

export default function CandidatesPage() {
  return <CandidatesPanel />
}
