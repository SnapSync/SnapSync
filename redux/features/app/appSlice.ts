import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  appLanguage: string;
}

const initialState: AppState = {
  appLanguage: "en",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppLanguage: (state, action) => {
      state.appLanguage = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAppLanguage } = appSlice.actions;

export default appSlice.reducer;
