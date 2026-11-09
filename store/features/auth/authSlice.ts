import { createSlice } from "@reduxjs/toolkit"

import { authApi } from "@/store/services/auth.api"
import { usersApi } from "@/store/services/users.api"
import type { User } from "@/types/auth"

interface AuthState {
  user: User | null
  token: string | null
}

const initialState: AuthState = { user: null, token: null }

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
        state.user = payload.user
        state.token = payload.token
      })
      // Buying the nomination form changes the signed-in user's role.
      .addMatcher(
        usersApi.endpoints.purchaseCandidateForm.matchFulfilled,
        (state, { payload }) => {
          state.user = payload
        }
      )
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
