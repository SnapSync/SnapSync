import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ColorSchemeName } from 'react-native';
import { IAccountInfoDTO, ITokenData } from '../types/IAccountInfoDTO';

export interface IAppReducer {
  isSignedIn?: boolean;
  userColorScheme?: ColorSchemeName;
  tokenData?: ITokenData;
}

const initialState: IAppReducer = {};

export const appSlice = createSlice({
  name: 'appReducer',
  initialState,
  reducers: {
    SignIn: (state, action: PayloadAction<IAccountInfoDTO>) => {
      state.isSignedIn = true;
      state.tokenData = action.payload.tokenData;
    },
    SignOut: (state) => {
      state.isSignedIn = false;
      state.tokenData = undefined;
    },
    SetColorShceme: (state, action: PayloadAction<ColorSchemeName | undefined>) => {
      state.userColorScheme = action.payload;
    },
  },
});

export const { SignIn, SignOut, SetColorShceme } = appSlice.actions;

export default appSlice.reducer;
