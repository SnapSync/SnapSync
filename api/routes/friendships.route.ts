import { IFriendshipStatus } from "@/interfaces/friendship_status.interface";
import client from "..";
import { IApiUser } from "@/interfaces/users.interface";

const path = "/friendships";

export const FetchUserFriends = async (
  page: number,
  tokenApi: string,

  size: number = 30,
  query: string | null = null
): Promise<{
  message: string;
  data: IApiUser[];
  nextCursor: number | undefined;
  prevCursor: number | undefined;
  // pagination: Pagination;
}> => {
  try {
    if (page < 1) page = 1;
    if (size < 1) size = 1;

    const { data } = await client.get(`${path}/friends`, {
      params: {
        query,
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

export const FetchUserReceivedFriendRequests = async (
  page: number,
  tokenApi: string,

  size: number = 30,
  query: string | null = null
): Promise<{
  message: string;
  data: IApiUser[];
  nextCursor: number | undefined;
  prevCursor: number | undefined;
  // pagination: Pagination;
}> => {
  try {
    if (page < 1) page = 1;
    if (size < 1) size = 1;

    const { data } = await client.get(`${path}/friend-requests/received`, {
      params: {
        query,
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

export const FetchUserSentFriendRequests = async (
  page: number,
  tokenApi: string,

  size: number = 30,
  query: string | null = null
): Promise<{
  message: string;
  data: IApiUser[];
  nextCursor: number | undefined;
  prevCursor: number | undefined;
  // pagination: Pagination;
}> => {
  try {
    if (page < 1) page = 1;
    if (size < 1) size = 1;

    const { data } = await client.get(`${path}/friend-requests/sent`, {
      params: {
        query,
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

export const ShowFriendship = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.get(`${path}/show/${userId}`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const FetchReceivedFriendRequestsCount = async (
  tokenApi: string
): Promise<{
  message: string;
  count: number;
}> => {
  try {
    const { data } = await client.get(
      `${path}/friend-requests/received/count`,
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

export const FetchSentFriendRequestsCount = async (
  tokenApi: string
): Promise<{
  message: string;
  count: number;
}> => {
  try {
    const { data } = await client.get(`${path}/friend-requests/sent/count`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AcceptFriendRequest = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.post(
      `${path}/accept/${userId}`,
      {},
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

export const DenyFriendRequest = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.post(
      `${path}/reject/${userId}`,
      {},
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

export const SendFriendRequest = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.post(
      `${path}/create/${userId}`,
      {},
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

export const DestroyFriendship = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.post(
      `${path}/destroy/${userId}`,
      {},
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

export const BlockUser = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.post(
      `${path}/block/${userId}`,
      {},
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

export const UnblockUser = async (
  userId: number,
  tokenApi: string
): Promise<IFriendshipStatus> => {
  try {
    const { data } = await client.delete(`${path}/unblock/${userId}`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
