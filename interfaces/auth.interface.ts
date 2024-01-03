export interface TokenData {
  token: string;
  expiresIn: number;
  refreshToken: string;
}

export interface ILoginResponse {
  userId: number;
  tokenData: TokenData;
  vexoToken: string;
  accessToken: string; // selector:validator
}
