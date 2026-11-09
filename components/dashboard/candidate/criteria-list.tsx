import { CircleCheck, CircleX } from "lucide-react"

import { CRITERION_LABELS } from "@/constants/labels"
import { meetsCriterion } from "@/lib/eligibility"
import { cn } from "@/lib/utils"
import type { User } from "@/types/auth"
import type { Position } from "@/types/election"

/** Shows each criterion and whether the user currently meets it. */
export function CriteriaList({ user, position }: { user: User; position: Position }) {
  if (position.criteria.length === 0) {
    return <p className="text-xs text-muted-foreground">No special criteria.</p>
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {position.criteria.map((criterion) => {
        const met = meetsCriterion(user, criterion)
        const Icon = met ? CircleCheck : CircleX
        return (
          <li
            key={criterion.type}
            className={cn(
              "flex items-center gap-2 text-sm",
              met ? "text-foreground" : "text-destructive"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {CRITERION_LABELS[criterion.type]}: {criterion.value}
          </li>
        )
      })}
    </ul>
  )
}
