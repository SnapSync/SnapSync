import { IUserProfile } from "@/interfaces/users_profiles.interface";
import client from "..";
import { IApiUser } from "@/interfaces/users.interface";

const path = "/users";

export const FetchAllUsers = async (): Promise<{
  data: IApiUser[];
  message: string;
}> => {
  try {
    const { data } = await client.get(`${path}`);

    return data;
  } catch (error) {
    throw error;
  }
};

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

export const FetchMeJoinedAt = async (
  tokenApi: string
): Promise<{
  message: string;
  joinedAt: number;
}> => {
  try {
    const { data } = await client.get(`${path}/me/joined_at`, {
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
