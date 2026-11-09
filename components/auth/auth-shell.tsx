import { BrandPanel } from "@/components/auth/brand-panel"
import { Logo } from "@/components/brand/logo"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[46%] lg:max-w-[640px] lg:shrink-0">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Votely. All rights reserved.
        </p>
      </div>
      <BrandPanel />
    </div>
  )
}
