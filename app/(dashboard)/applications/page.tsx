import type { Metadata } from "next"

import { MyApplications } from "@/components/dashboard/candidate/my-applications"

export const metadata: Metadata = { title: "My applications | Votely" }

export default function ApplicationsPage() {
  return <MyApplications />
}
