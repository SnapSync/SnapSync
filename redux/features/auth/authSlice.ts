import { ILoginResponse } from "@/interfaces/auth.interface";
import { IApiUser } from "@/interfaces/users.interface";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface State {
  isLoggedIn: boolean;
  tokenApi: string;
  refreshTokenApi: string;
  me?: IApiUser;

  authToken?: string;
}

const initialState: State = {
  isLoggedIn: false,
  tokenApi: "",
  refreshTokenApi: "",
  me: undefined,

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
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.tokenApi = "";
      state.refreshTokenApi = "";
      state.me = undefined;
      state.authToken = undefined;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    removeAuthToken: (state) => {
      state.authToken = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setAuthToken, removeAuthToken } =
  authSlice.actions;

export default authSlice.reducer;
