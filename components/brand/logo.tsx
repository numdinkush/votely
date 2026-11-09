import { Vote } from "lucide-react"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  textClassName?: string
}

export function Logo({ className, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
        <Vote className="size-5" />
      </span>
      <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
        Votely
      </span>
    </div>
  )
}
