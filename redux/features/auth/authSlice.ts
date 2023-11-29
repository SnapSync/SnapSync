import { ILoginResponse } from "@/interfaces/auth.interface";
import { IApiUser } from "@/interfaces/users.interface";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface State {
  isLoggedIn: boolean;
  tokenApi: string;
  refreshTokenApi: string;
  userId?: number;

  authToken?: string;
}

const initialState: State = {
  isLoggedIn: false,
  tokenApi: "",
  refreshTokenApi: "",

  authToken: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginResponse>) => {
      state.isLoggedIn = true;
      state.tokenApi = action.payload.tokenData.token;
      state.refreshTokenApi = action.payload.tokenData.refreshToken;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.tokenApi = "";
      state.refreshTokenApi = "";
      state.authToken = undefined;
      state.userId = undefined;
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setAuthToken, setUserId } = authSlice.actions;

export default authSlice.reducer;
