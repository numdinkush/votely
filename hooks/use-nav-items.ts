"use client"

import { usePathname } from "next/navigation"

import { NAV_ITEMS, type NavItem } from "@/constants/navigation"
import { useAbility } from "@/lib/acl/context"

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/** Menu entries the current user may see, plus the one matching the route. */
export function useNavItems() {
  const ability = useAbility()
  const pathname = usePathname()

  const can = (item: NavItem) =>
    !item.permission || ability.can(item.permission.action, item.permission.subject)

  const items = NAV_ITEMS.filter(can)
  const current = NAV_ITEMS.find((item) => isActive(pathname, item.href))

  return {
    items,
    pathname,
    isActive: (item: NavItem) => isActive(pathname, item.href),
    current,
    /** False when the current route needs a permission the user lacks. */
    canAccessCurrent: !current || can(current),
  }
}
