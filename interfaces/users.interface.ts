export interface IUserProfilePicture {
  url: string;
  width: number;
  height: number;
  blurHash: string | null;
}

export interface IUserProfileZodiacSign {
  name: string;
  symbol: string;
}

export interface IApiUser {
  id: number;
  username: string;
  fullname: string;
  isVerified: boolean;
  profilePicture: IUserProfilePicture | null;
  zodiacSign: IUserProfileZodiacSign;

  biography?: string | null;

  contactNickname?: string;
  mutualFriends?: number;
  streak?: number;

  isNotSynced?: boolean; // is a local used property only, it tells us if the current state of the exercise is synced with the backend.
}
