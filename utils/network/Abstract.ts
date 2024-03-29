export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH";

export enum MethodEnum {
  GET = "GET",
  DELETE = "DELETE",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
}

export interface IResult<T> {
  // success: boolean;
  message: string;
  // statusCode?: number;
  result: T;
  // errorCodes?: Array<number>;
}

export interface IError {
  status: number;
  message: string;
  type: string | null;
  fields: Array<string> | null;
  timestamp: string;
  data: any;
}

export type Result<T = any, Response = IResult<T>> = Response;

export interface IApiResult {
  data: {
    data: unknown;
    statusCode: number;
    message: string;
  };
  errorMessaging: boolean;
}

export interface IApiParams {
  url: string;
  headers?: any;
  queryString?: string;
  data?: any;
  // successMessaging?: boolean;
  // errorMessaging?: boolean;
  // version?: string;
}

export interface INetworkParams extends IApiParams {
  method?: Method;
}

export function isIError(error: unknown): error is IError {
  return (error as IError).status !== undefined;
}
