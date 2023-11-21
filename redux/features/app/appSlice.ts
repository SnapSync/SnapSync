import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  appLanguage: string;
  deviceUuid?: string;

  unauthorizedModalVisible: boolean;
  unauthorizedModalTitle?: string;
  unauthorizedModalMessage?: string;
}

const initialState: AppState = {
  appLanguage: "en",

  unauthorizedModalVisible: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppLanguage: (state, action) => {
      state.appLanguage = action.payload;
    },
    setDeviceUuid: (state, action) => {
      state.deviceUuid = action.payload;
    },

    showUnauthorizedModal: (
      state,
      action: { payload: { title: string; message: string } }
    ) => {
      state.unauthorizedModalVisible = true;
      state.unauthorizedModalTitle = action.payload.title;
      state.unauthorizedModalMessage = action.payload.message;
    },
    hideUnauthorizedModal: (state) => {
      state.unauthorizedModalVisible = false;
      state.unauthorizedModalTitle = undefined;
      state.unauthorizedModalMessage = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAppLanguage,
  setDeviceUuid,
  showUnauthorizedModal,
  hideUnauthorizedModal,
} = appSlice.actions;

export default appSlice.reducer;
