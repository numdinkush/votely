"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { ROUTES } from "@/constants/app"
import { useCurrentUser } from "@/hooks/use-current-user"

/** Renders children only for signed-in users; others go to the login page. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.replace(ROUTES.LOGIN)
  }, [user, router])

  return user ? <>{children}</> : null
}
