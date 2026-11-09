import {
  applyForPosition,
  createCandidate,
  deleteCandidate,
  listCandidates,
  listCandidatesForUser,
  updateCandidate,
} from "@/lib/api/candidates"
import { mockQuery } from "@/lib/api/mock-query"
import { ApiTag, baseApi } from "@/store/services/base.api"
import type {
  Candidate,
  CandidateDetails,
  CandidateInput,
} from "@/types/election"

export const candidatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidates: builder.query<CandidateDetails[], void>({
      queryFn: mockQuery(listCandidates),
      providesTags: [ApiTag.CANDIDATE],
    }),
    getMyCandidacies: builder.query<CandidateDetails[], string>({
      queryFn: mockQuery(listCandidatesForUser),
      providesTags: [ApiTag.CANDIDATE],
    }),
    createCandidate: builder.mutation<Candidate, CandidateInput>({
      queryFn: mockQuery(createCandidate),
      invalidatesTags: [ApiTag.CANDIDATE, ApiTag.USER],
    }),
    updateCandidate: builder.mutation<
      Candidate,
      Partial<CandidateInput> & { id: string }
    >({
      queryFn: mockQuery(updateCandidate),
      invalidatesTags: [ApiTag.CANDIDATE],
    }),
    deleteCandidate: builder.mutation<string, string>({
      queryFn: mockQuery(deleteCandidate),
      invalidatesTags: [ApiTag.CANDIDATE, ApiTag.VOTE],
    }),
    applyForPosition: builder.mutation<
      Candidate,
      { userId: string; electionId: string; positionId: string }
    >({
      queryFn: mockQuery(applyForPosition),
      invalidatesTags: [ApiTag.CANDIDATE],
    }),
  }),
})

export const {
  useGetCandidatesQuery,
  useGetMyCandidaciesQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useApplyForPositionMutation,
} = candidatesApi
