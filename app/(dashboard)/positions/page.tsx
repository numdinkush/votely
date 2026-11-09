import type { Metadata } from "next"

import { OpenPositions } from "@/components/dashboard/candidate/open-positions"

export const metadata: Metadata = { title: "Open positions | Votely" }

export default function PositionsPage() {
  return <OpenPositions />
}
