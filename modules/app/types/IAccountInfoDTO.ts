export interface IAccountInfoDTO {
  userId: number;
  vexoToken: string;
  tokenData: ITokenData;
  accessToken: string;
}

export interface ITokenData {
  token: string;
  expiresIn: number;
  refreshToken: string;
}
