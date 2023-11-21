export interface IApiUser {
  id: number;
  username: string;
  fullname: string;
  isVerified: boolean;
  profilePicture: {
    url: string;
    width: number;
    height: number;
  } | null;
}
