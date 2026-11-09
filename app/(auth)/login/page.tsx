import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign in | Votely" }

export default function LoginPage() {
  return <LoginForm />
}
