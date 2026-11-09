"use client"

import { useRouter } from "next/navigation"

import { ROUTES } from "@/constants/app"
import { logout } from "@/store/features/auth/authSlice"
import { useAppDispatch } from "@/store/hooks"
import { baseApi } from "@/store/services/base.api"

/** Clears the session and cached API data, then returns to the login page. */
export function useSignOut() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  return () => {
    dispatch(logout())
    dispatch(baseApi.util.resetApiState())
    router.replace(ROUTES.LOGIN)
  }
}
