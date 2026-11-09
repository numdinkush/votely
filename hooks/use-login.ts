"use client"

import { useRouter } from "next/navigation"

import { ROUTES } from "@/constants/app"
import { useSignInMutation } from "@/store/services/auth.api"
import type { LoginCredentials } from "@/types/auth"

/** Wraps the sign-in mutation: returns an error message and redirects on success. */
export function useLogin() {
  const router = useRouter()
  const [signIn, { isLoading, error, reset }] = useSignInMutation()

  const login = async (credentials: LoginCredentials) => {
    const result = await signIn(credentials)
    if ("data" in result) router.push(ROUTES.DASHBOARD)
  }

  return { login, isLoading, error: error?.message ?? null, reset }
}
