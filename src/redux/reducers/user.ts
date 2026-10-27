import type { User } from "@/types/auth.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  /** true until the first Firebase auth state callback has run */
  initialising: boolean;
}

const initialState: UserState = { user: null, initialising: true };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user;
      state.initialising = false;
    },
    clearUserData: (state) => {
      state.user = null;
      state.initialising = false;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
