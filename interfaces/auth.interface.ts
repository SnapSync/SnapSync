export interface TokenData {
  token: string;
  expiresIn: number;
  refreshToken: string;
}

export interface ILoginResponse {
  tokenData: TokenData;
  accessToken: string; // selector:validator
}
