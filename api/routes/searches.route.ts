import client from "..";
import { IApiUser } from "@/interfaces/users.interface";

const path = "/searches";

export const SearchByQuery = async (
  query: string,
  page: number,
  tokenApi: string,

  size: number = 30
): Promise<{
  friends: IApiUser[];
  sent: IApiUser[];
  received: IApiUser[];
  contacts: IApiUser[];
  others: IApiUser[];
  message: string;
}> => {
  try {
    if (page < 1) page = 1;
    if (size < 1) size = 1;

    const { data } = await client.get(`${path}/search`, {
      params: {
        q: query,
        page: 1,
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
