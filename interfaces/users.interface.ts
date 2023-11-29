export interface IUserProfilePicture {
  url: string;
  width: number;
  height: number;
}

export interface IApiUser {
  id: number;
  username: string;
  fullname: string;
  isVerified: boolean;
  profilePicture: IUserProfilePicture | null;

  contactNickname?: string | null;
  mutualFriends?: number | null;
  streak?: number | null;

  isNotSynced?: boolean; // is a local used property only, it tells us if the current state of the exercise is synced with the backend.
}
