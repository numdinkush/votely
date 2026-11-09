import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/app"

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card py-20 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">You don&apos;t have access to this page</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your role does not include permission to view this section.
      </p>
      <Button nativeButton={false} render={<Link href={ROUTES.DASHBOARD} />}>
        Back to dashboard
      </Button>
    </div>
  )
}
