import { IDevice } from "@/interfaces/devices.interface";
import client from "..";

const path = "/devices";

export const RegisterDevice = async (
  platformOs: string
): Promise<{
  message: string;
  device: IDevice;
}> => {
  try {
    const body = {
      platformOs: platformOs,
    };

    const { data } = await client.post(`${path}/register`, body);

    return data;
  } catch (error) {
    throw error;
  }
};
