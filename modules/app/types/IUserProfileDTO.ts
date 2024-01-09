import { IUserProfilePicture } from "./IUserDTO";

export interface IUserProfileDTO {
  id: number;
  username: string;
  dateOfBirth: Date;
  fullname: string;
  isVerified: boolean;

  phoneNumber?: string; // Visibile solo se è il mio profilo

  biography: string | null;

  location: {
    latitude: number;
    longitude: number;
  } | null;

  profilePicture: IUserProfilePicture | null;

  isPrivate: boolean;

  isMyProfile: boolean;

  streak?: number | null;
}
