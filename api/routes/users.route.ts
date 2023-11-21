import { IUserProfile } from "@/interfaces/users_profiles.interface";
import client from "..";
import { IApiUser } from "@/interfaces/users.interface";

const path = "/users";

export const FetchMe = async (tokenApi: string): Promise<IApiUser> => {
  try {
    const { data } = await client.get(`${path}/me`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const FetchUserProfileById = async (
  id: number,
  tokenApi: string
): Promise<IUserProfile> => {
  try {
    const { data } = await client.get(`${path}/profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
