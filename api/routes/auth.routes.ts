import { ILoginResponse } from "@/interfaces/auth.interface";
import client from "..";

const path = "/auth";

export const GetSessionId = async (): Promise<{
  sessionId: string;
  message: string;
}> => {
  try {
    const { data } = await client.get(`${path}/get_session_id`, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidateFullname = async (
  fullname: string,
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      fullname: fullname,
    };

    const { data } = await client.post(`${path}/fullname`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidateDateOfBirth = async (
  sessionId: string,
  yearOfBirth: number,
  monthOfBirth: number,
  dayOfBirth: number
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      yearOfBirth: yearOfBirth,
      monthOfBirth: monthOfBirth,
      dayOfBirth: dayOfBirth,
    };

    const { data } = await client.post(`${path}/date_of_birth`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidatePhoneNumber = async (
  sessionId: string,
  phoneNumber: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      phoneNumber: phoneNumber,
    };

    const { data } = await client.post(`${path}/phone_number`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const ResendPhoneNumberVerificationCode = async (
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
    };

    const { data } = await client.post(`${path}/resend_otp`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidatePhoneNumberVerificationCode = async (
  code: string,
  sessionId: string
): Promise<{
  goNext: boolean;
  data?: ILoginResponse;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      otp: code,
    };

    const { data } = await client.post(`${path}/otp`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidateUsername = async (
  username: string,
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      username: username,
    };

    const { data } = await client.post(`${path}/username`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const LoginWithAuthToken = async (
  authToken: string
): Promise<{
  data: ILoginResponse;
  message: string;
}> => {
  try {
    const body = {
      authToken: authToken,
    };

    const { data } = await client.post(`${path}/auth_token/exchange`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};

export const SignUp = async (
  sessionId: string
): Promise<{
  data: ILoginResponse;
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
    };

    const { data } = await client.post(`${path}/signup`, body, {});

    return data;
  } catch (error) {
    throw error;
  }
};
