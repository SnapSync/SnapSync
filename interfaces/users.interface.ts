export interface IApiUser {
  id: number;
  username: string;
  fullName: string;
  isVerified: boolean;
  profilePictureUrl: string;

  socialContext?: string;
  streak?: number;
}
