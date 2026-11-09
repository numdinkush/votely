import { mockQuery } from "@/lib/api/mock-query"
import { castBallot, listMyVotes, listResults } from "@/lib/api/votes"
import { ApiTag, baseApi } from "@/store/services/base.api"
import type { BallotInput, ElectionResult, Vote } from "@/types/election"

export const votesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyVotes: builder.query<Vote[], string>({
      queryFn: mockQuery(listMyVotes),
      providesTags: [ApiTag.VOTE],
    }),
    getResults: builder.query<ElectionResult[], void>({
      queryFn: mockQuery(listResults),
      providesTags: [ApiTag.VOTE, ApiTag.ELECTION, ApiTag.CANDIDATE],
    }),
    castBallot: builder.mutation<Vote[], BallotInput>({
      queryFn: mockQuery(castBallot),
      invalidatesTags: [ApiTag.VOTE],
    }),
  }),
})

export const {
  useGetMyVotesQuery,
  useGetResultsQuery,
  useCastBallotMutation,
} = votesApi
