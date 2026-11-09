"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ROLE_LABELS } from "@/constants/labels"
import { useAuthUser } from "@/hooks/use-current-user"
import { useNavItems } from "@/hooks/use-nav-items"
import { useSignOut } from "@/hooks/use-sign-out"

const ACTIVE_ITEM =
  "data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary/90 data-active:hover:text-primary-foreground"

export function AppSidebar() {
  const user = useAuthUser()
  const { items, isActive } = useNavItems()
  const signOut = useSignOut()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Logo textClassName="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item)}
                    tooltip={item.label}
                    className={ACTIVE_ITEM}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-1 rounded-lg bg-muted/60 p-3 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-1 w-fit">
            {ROLE_LABELS[user.role]}
          </Badge>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" onClick={signOut}>
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
