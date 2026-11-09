import { Badge } from "@/components/ui/badge"
import type { StatusMeta } from "@/constants/labels"

export function StatusBadge({ meta }: { meta: StatusMeta }) {
  return <Badge variant={meta.tone}>{meta.label}</Badge>
}
