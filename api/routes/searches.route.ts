import client from "..";
import { IApiUser } from "@/interfaces/users.interface";

const path = "/searches";

export const SearchByQuery = async (
  query: string,
  tokenApi: string
): Promise<{
  friends: IApiUser[];
  sent: IApiUser[];
  received: IApiUser[];
  // contacts: IApiUser[];
  others: IApiUser[];
  message: string;
}> => {
  try {
    const { data } = await client.get(`${path}/search`, {
      params: {
        q: query,
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
