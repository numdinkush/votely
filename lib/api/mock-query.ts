import type { ApiError } from "@/types/auth"

type QueryResult<T> = { data: T } | { error: ApiError }

/**
 * Adapts an async mock-API function into an RTK Query `queryFn`
 * (thrown errors become `{ error: { message } }`).
 */
export const mockQuery =
  <Arg, Result>(fn: (arg: Arg) => Promise<Result>) =>
  async (arg: Arg): Promise<QueryResult<Result>> => {
    try {
      return { data: await fn(arg) }
    } catch (e) {
      return {
        error: { message: e instanceof Error ? e.message : "Request failed" },
      }
    }
  }
