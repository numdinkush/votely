import { CalendarDays } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ELECTION_STATUS_META } from "@/constants/labels"
import { formatDate } from "@/lib/format"
import type { Election } from "@/types/election"

interface ElectionCardProps {
  election: Election
  /** Optional footer, e.g. a role-specific call to action. */
  footer?: React.ReactNode
}

export function ElectionCard({ election, footer }: ElectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{election.title}</CardTitle>
          <StatusBadge meta={ELECTION_STATUS_META[election.status]} />
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {formatDate(election.startDate)} - {formatDate(election.endDate)}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {election.positions.map((position) => (
            <Badge key={position.id} variant="outline">
              {position.title}
            </Badge>
          ))}
        </div>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
