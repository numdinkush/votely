import { login } from "@/lib/api/auth"
import { mockQuery } from "@/lib/api/mock-query"
import { baseApi } from "@/store/services/base.api"
import type { AuthSession, LoginCredentials } from "@/types/auth"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthSession, LoginCredentials>({
      queryFn: mockQuery(login),
    }),
  }),
})

export const { useSignInMutation } = authApi
