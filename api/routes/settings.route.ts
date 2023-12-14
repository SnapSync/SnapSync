import { IWebInfo } from "@/interfaces/web_info.interface";
import client from "..";
import { IResponseInfinite } from "./friendships.route";

const path = "/settings";

export interface IResponseWebInfo {
  webInfo: IWebInfo;
  message: string;
}

export const FetchUserBlockedUsers = async (
  page: number,
  tokenApi: string,

  size: number = 30
): Promise<IResponseInfinite> => {
  try {
    if (page < 1) page = 1;
    if (size < 1) size = 1;

    const { data } = await client.get(`${path}/blocked_users`, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const FetchUserBlockedUsersCount = async (
  tokenApi: string
): Promise<{
  total: number;
  message: string;
}> => {
  try {
    const { data } = await client.get(`${path}/blocked_users/count`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data.count;
  } catch (error) {
    throw error;
  }
};

export const FetchWebInfo = async (
  tokenApi: string
): Promise<IResponseWebInfo> => {
  try {
    const { data } = await client.get(`${path}/web_info`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const UpdateAllowSyncContacts = async (
  allowSyncContacts: boolean,
  tokenApi: string
): Promise<IResponseWebInfo> => {
  try {
    const { data } = await client.put(
      `${path}/allow_sync_contacts`,
      { allowSyncContacts },
      {
        headers: {
          Authorization: `Bearer ${tokenApi}`,
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};
