export interface IUserDTO {
  id: number;
  username: string;
  fullname: string;
  isVerified: boolean;
  profilePicture: IUserProfilePicture | null;
  zodiacSign: IUserZodiacSign;

  biography?: string | null;

  // contactNickname?: string;
  mutualFriends?: number;
  streak?: number;
}

export interface IUserProfilePicture {
  url: string;
  width: number;
  height: number;
  blurHash: string | null;
}

export interface IUserZodiacSign {
  name: string;
  symbol: string;
}
