import { IDevice } from "@/interfaces/devices.interface";
import client from "..";

const path = "/devices";

export const RegisterDevice = async (
  platformOs: string,
  deviceType: string
): Promise<{
  message: string;
  device: IDevice;
}> => {
  try {
    const body = {
      platformOs: platformOs,
      deviceType: deviceType,
    };

    const { data } = await client.post(`${path}/register`, body);

    return data;
  } catch (error) {
    throw error;
  }
};
