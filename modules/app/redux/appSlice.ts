import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ColorSchemeName } from "react-native";
import { IAccountInfoDTO, ITokenData } from "../types/IAccountInfoDTO";

export interface IAppReducer {
  isSignedIn?: boolean;
  userColorScheme?: ColorSchemeName;
  user?: any;
  tokenData?: ITokenData;
}

const initialState: IAppReducer = {};

export const appSlice = createSlice({
  name: "appReducer",
  initialState,
  reducers: {
    SignIn: (state, action: PayloadAction<IAccountInfoDTO>) => {
      state.isSignedIn = true;
      state.tokenData = action.payload.tokenData;
    },
    SetUser: (
      state,
      action: PayloadAction<{
        name: string;
      }>
    ) => {
      state.isSignedIn = true;
      state.user = action.payload;
    },
    ClearUser: (state) => {
      state = { ...state, user: {}, isSignedIn: false };

      return state;
    },
    SetColorShceme: (
      state,
      action: PayloadAction<ColorSchemeName | undefined>
    ) => {
      state.userColorScheme = action.payload;
    },
  },
});

export const { SignIn, SetUser, ClearUser, SetColorShceme } = appSlice.actions;

export default appSlice.reducer;
