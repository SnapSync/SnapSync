import { IUserProfilePicture } from "./users.interface";

export interface IEditWebFormData {
  username: string;
  fullname: string;
  biography: string | null;
  profilePicture: IUserProfilePicture | null;
}
