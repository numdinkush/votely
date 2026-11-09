"use client"

import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ROUTES } from "@/constants/app"
import { useAuthUser } from "@/hooks/use-current-user"
import { useNavItems } from "@/hooks/use-nav-items"
import { getGreeting } from "@/lib/format"

export function AppNavbar() {
  const user = useAuthUser()
  const { pathname, current } = useNavItems()

  const heading =
    pathname === ROUTES.DASHBOARD
      ? `${getGreeting()}, ${user.name.split(" ")[0]}!`
      : (current?.label ?? "Votely")

  return (
    <header className="sticky top-4 z-10 mx-4 mt-4 flex h-16 items-center gap-3 rounded-xl bg-card px-3 shadow-xs ring-1 ring-foreground/10 md:mx-6 md:mr-6 md:ml-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6 data-vertical:self-center" />
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">
          Welcome to <span className="font-semibold text-foreground">Votely</span>
        </p>
        <h1 className="truncate text-base leading-tight font-semibold">
          {heading}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
