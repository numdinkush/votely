import type { Metadata } from "next"

import { ElectionsPanel } from "@/components/dashboard/admin/elections-panel"

export const metadata: Metadata = { title: "Elections | Votely" }

export default function ElectionsPage() {
  return <ElectionsPanel />
}
