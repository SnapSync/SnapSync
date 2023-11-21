import { IFriendshipStatus } from "./friendship_status.interface";

export interface IUserProfile {
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

  profilePicture: {
    url: string;
    width: number;
    height: number;
  } | null;

  isPrivate: boolean;

  isMyProfile: boolean;

  friendshipStatus?: IFriendshipStatus;
}
