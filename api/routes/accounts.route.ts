import client from "..";

const path = "/accounts";

export const GetFullnameRules = async (): Promise<{
  maxLength: number;
  minLength: number;
  regex: RegExp;
}> => {
  try {
    const { data } = await client.get(`${path}/full_name/rules`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetUsernamenameRules = async (): Promise<{
  maxLength: number;
  minLength: number;
  regex: RegExp;
}> => {
  try {
    const { data } = await client.get(`${path}/username/rules`);

    return data;
  } catch (error) {
    throw error;
  }
};
