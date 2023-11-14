import { AuthDto } from "@/dtos/auth.dto";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface State {
  authDto: AuthDto;
}

const initialState: State = {
  authDto: {
    username: "",
    yearOfBirth: null,
    monthOfBirth: null,
    dayOfBirth: null,
  },
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    updateSessionId: (state, action: PayloadAction<string>) => {
      state.authDto.sessionId = action.payload;
    },

    updateFullname: (state, action: PayloadAction<string>) => {
      state.authDto.fullName = action.payload;
    },

    updateMonthOfBirth: (state, action: PayloadAction<number | null>) => {
      state.authDto.monthOfBirth = action.payload;
    },
    updateDayOfBirth: (state, action: PayloadAction<number | null>) => {
      state.authDto.dayOfBirth = action.payload;
    },
    updateYearOfBirth: (state, action: PayloadAction<number | null>) => {
      state.authDto.yearOfBirth = action.payload;
    },

    updatePhoneNumber: (state, action: PayloadAction<string>) => {
      state.authDto.phoneNumber = action.payload;
    },
    updatePhoneNumberFormatted: (state, action: PayloadAction<string>) => {
      state.authDto.phoneNumberFormatted = action.payload;
    },
    updatePhoneNumberCountryCode: (state, action: PayloadAction<string>) => {
      state.authDto.phoneNumberCountryCode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateSessionId,

  updateFullname,

  updateMonthOfBirth,
  updateDayOfBirth,
  updateYearOfBirth,

  updatePhoneNumber,
  updatePhoneNumberFormatted,
  updatePhoneNumberCountryCode,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
