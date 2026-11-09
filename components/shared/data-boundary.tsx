import { Loader2 } from "lucide-react"

interface DataBoundaryProps {
  isLoading: boolean
  isEmpty: boolean
  emptyMessage: string
  children: React.ReactNode
}

/** Renders loading / empty states, otherwise the children. */
export function DataBoundary({
  isLoading,
  isEmpty,
  emptyMessage,
  children,
}: DataBoundaryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return <>{children}</>
}
