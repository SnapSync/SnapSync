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
