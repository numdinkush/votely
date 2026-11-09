import {
  createElection,
  deleteElection,
  listElections,
  updateElection,
} from "@/lib/api/elections"
import { mockQuery } from "@/lib/api/mock-query"
import { ApiTag, baseApi } from "@/store/services/base.api"
import type { Election, ElectionInput } from "@/types/election"

export const electionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getElections: builder.query<Election[], void>({
      queryFn: mockQuery(listElections),
      providesTags: [ApiTag.ELECTION],
    }),
    createElection: builder.mutation<Election, ElectionInput>({
      queryFn: mockQuery(createElection),
      invalidatesTags: [ApiTag.ELECTION],
    }),
    updateElection: builder.mutation<
      Election,
      Partial<ElectionInput> & { id: string }
    >({
      queryFn: mockQuery(updateElection),
      invalidatesTags: [ApiTag.ELECTION, ApiTag.CANDIDATE],
    }),
    deleteElection: builder.mutation<string, string>({
      queryFn: mockQuery(deleteElection),
      invalidatesTags: [ApiTag.ELECTION, ApiTag.CANDIDATE, ApiTag.VOTE],
    }),
  }),
})

export const {
  useGetElectionsQuery,
  useCreateElectionMutation,
  useUpdateElectionMutation,
  useDeleteElectionMutation,
} = electionsApi
