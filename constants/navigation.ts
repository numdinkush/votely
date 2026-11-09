import {
  Briefcase,
  CalendarCheck,
  ChartColumn,
  ClipboardList,
  LayoutDashboard,
  UsersRound,
  Vote,
  type LucideIcon,
} from "lucide-react"

import { ROUTES } from "@/constants/app"
import { Action, Subject } from "@/constants/enums"
import type { Permission } from "@/constants/permissions"

export interface NavItem {
  key: string
  label: string
  href: string
  icon: LucideIcon
  /** Needed to see the menu entry and open the route. Omit for any signed-in user. */
  permission?: Permission
}

/**
 * Sidebar menu. Entries are filtered by the user's CASL ability, and the same
 * `permission` guards the route itself, so menu and access never drift apart.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    key: "elections",
    label: "Elections",
    href: ROUTES.ELECTIONS,
    icon: CalendarCheck,
    permission: { action: Action.UPDATE, subject: Subject.ELECTION },
  },
  {
    key: "candidates",
    label: "Candidates",
    href: ROUTES.CANDIDATES,
    icon: UsersRound,
    permission: { action: Action.APPROVE, subject: Subject.CANDIDATE },
  },
  {
    key: "positions",
    label: "Open positions",
    href: ROUTES.POSITIONS,
    icon: Briefcase,
    permission: { action: Action.APPLY, subject: Subject.POSITION },
  },
  {
    key: "applications",
    label: "My applications",
    href: ROUTES.APPLICATIONS,
    icon: ClipboardList,
    permission: { action: Action.APPLY, subject: Subject.POSITION },
  },
  {
    key: "ballots",
    label: "Vote",
    href: ROUTES.BALLOTS,
    icon: Vote,
    permission: { action: Action.VOTE, subject: Subject.ELECTION },
  },
  {
    key: "results",
    label: "Results",
    href: ROUTES.RESULTS,
    icon: ChartColumn,
    permission: { action: Action.READ, subject: Subject.ELECTION },
  },
]
