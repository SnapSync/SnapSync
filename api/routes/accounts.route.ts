import { IUserProfilePicture } from "@/interfaces/users.interface";
import client, { API_URL } from "..";
import { IEditWebFormData } from "@/interfaces/edit_web_form_data";
import * as FileSystem from "expo-file-system";

const path = "/accounts";

// export const GetFullnameRules = async (): Promise<{
//   maxLength: number;
//   minLength: number;
//   regex: RegExp;
// }> => {
//   try {
//     const { data } = await client.get(`${path}/full_name/rules`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const GetUsernamenameRules = async (): Promise<{
//   maxLength: number;
//   minLength: number;
//   regex: RegExp;
// }> => {
//   try {
//     const { data } = await client.get(`${path}/username/rules`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const FetchEditWebFormData = async (
  tokenApi: string
): Promise<IEditWebFormData> => {
  try {
    const { data } = await client.get(`${path}/edit/web_form_data`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const UpdateAccount = async (
  tokenApi: string,
  username: string,
  fullname: string,
  biography: string | null
): Promise<IEditWebFormData> => {
  try {
    const { data } = await client.post(
      `${path}/edit`,
      {
        username,
        fullname,
        biography,
      },
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

export const WebRemoveProfilePicture = async (
  tokenApi: string
): Promise<{
  profilePicture: IUserProfilePicture | null;
  message: string;
}> => {
  try {
    const { data } = await client.post(
      `${path}/web_remove_profile_pic`,
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

export const WebChangeProfilePicture = async (
  uri: string,
  tokenApi: string
): Promise<{
  profilePicture: IUserProfilePicture | null;
  message: string;
}> => {
  try {
    const response = await FileSystem.uploadAsync(
      `${API_URL}${path}/web_change_profile_pic`,
      uri,
      {
        fieldName: "profilePicture",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
          Authorization: `Bearer ${tokenApi}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("An unexpected error occurred.");
    } else {
      return JSON.parse(response.body);
    }
  } catch (error) {
    throw error;
  }
};
