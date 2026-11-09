"use client"

import { useState } from "react"

import { AccessDenied } from "@/components/layout/access-denied"
import { AppNavbar } from "@/components/layout/app-navbar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useNavItems } from "@/hooks/use-nav-items"

/** Start expanded only when there is room; users can toggle it anytime. */
const EXPANDED_MIN_WIDTH = 1024
const initialOpen = () =>
  typeof window === "undefined" || window.innerWidth >= EXPANDED_MIN_WIDTH

/** Sidebar + navbar frame; blocks routes the user's role cannot access. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { canAccessCurrent } = useNavItems()
  const [open, setOpen] = useState(initialOpen)

  return (
    <TooltipProvider>
      <SidebarProvider open={open} onOpenChange={setOpen} className="bg-muted/40">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-transparent">
          <AppNavbar />
          <div className="flex-1 p-4 md:p-6 md:pl-2">
            {canAccessCurrent ? children : <AccessDenied />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
