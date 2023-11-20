import { ILoginResponse } from "@/interfaces/auth.interface";
import client from "..";

const path = "/auth";

export const GetSessionId = async (
  deviceUuid: string
): Promise<{
  sessionId: string;
  message: string;
}> => {
  try {
    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.get(`${path}/get_session_id`, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidateFullname = async (
  fullname: string,
  sessionId: string,
  deviceUuid: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      fullname: fullname,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/fullname`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidateDateOfBirth = async (
  sessionId: string,
  yearOfBirth: number,
  monthOfBirth: number,
  dayOfBirth: number,
  deviceUuid: string
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

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/date_of_birth`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidatePhoneNumber = async (
  sessionId: string,
  phoneNumber: string,
  deviceUuid: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      phoneNumber: phoneNumber,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/phone_number`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ResendPhoneNumberVerificationCode = async (
  sessionId: string,
  deviceUuid: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/resend_otp`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidatePhoneNumberVerificationCode = async (
  code: string,
  sessionId: string,
  deviceUuid: string
): Promise<{
  goNext: boolean;
  data?: ILoginResponse;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      otp: code,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/otp`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ValidateUsername = async (
  username: string,
  sessionId: string,
  deviceUuid: string
): Promise<{
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
      username: username,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/username`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const LoginWithAuthToken = async (
  authToken: string,
  deviceUuid?: string
): Promise<{
  data: ILoginResponse;
  message: string;
}> => {
  try {
    const body = {
      authToken: authToken,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/auth_token`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const SignUp = async (
  sessionId: string,
  deviceUuid: string
): Promise<{
  data: ILoginResponse;
  message: string;
}> => {
  try {
    const body = {
      sessionId: sessionId,
    };

    const header = {
      DeviceUuid: deviceUuid,
    };

    const { data } = await client.post(`${path}/signup`, body, {
      headers: header,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
