import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"

import type { ApiError } from "@/types/auth"

export enum ApiTag {
  ELECTION = "Election",
  CANDIDATE = "Candidate",
  USER = "User",
  VOTE = "Vote",
}

/**
 * Single RTK Query API; each resource injects its endpoints.
 * Swap `fakeBaseQuery` for `fetchBaseQuery` when a real backend exists.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: Object.values(ApiTag),
  endpoints: () => ({}),
})
