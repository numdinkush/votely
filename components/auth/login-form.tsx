"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Controller, useForm } from "react-hook-form"

import { PasswordInput } from "@/components/auth/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/use-login"
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth"

export function LoginForm() {
  const { login, isLoading, error, reset } = useLogin()
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your polls and ballots.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(({ email, password }) =>
          login({ email, password })
        )}
        onChange={reset}
        noValidate
      >
        <FieldGroup className="gap-5">
          {error && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@votely.com"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    className="pl-9"
                  />
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-11 w-full text-base"
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">Demo accounts</p>
        <p>admin@votely.com / password123</p>
        <p>voter@votely.com / password123</p>
      </div>
    </motion.div>
  )
}
