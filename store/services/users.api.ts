import { mockQuery } from "@/lib/api/mock-query"
import { listUsers, purchaseCandidateForm } from "@/lib/api/users"
import { ApiTag, baseApi } from "@/store/services/base.api"
import type { User } from "@/types/auth"

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: mockQuery(listUsers),
      providesTags: [ApiTag.USER],
    }),
    purchaseCandidateForm: builder.mutation<User, string>({
      queryFn: mockQuery(purchaseCandidateForm),
      invalidatesTags: [ApiTag.USER],
    }),
  }),
})

export const { useGetUsersQuery, usePurchaseCandidateFormMutation } = usersApi
