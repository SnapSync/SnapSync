import { IUserProfilePicture } from "../interfaces/users.interface";

export type CountResponse = {
  count: number;
  message: string;
};

export type InfiniteResponse<T> = {
  data: T[];
  nextCursor: number | undefined;
  prevCursor: number | undefined;
  total: number;
};

export type EditWebFormDataResponse = {
  username: string;
  fullname: string;
  biography: string | null;
  profilePicture: IUserProfilePicture | null;
};

export type FriendshipStatusResponse = {
  isFriend: boolean;
  incomingRequest: boolean;
  outgoingRequest: boolean;
  isBlocking: boolean;

  isNotSynced?: boolean; // is a local used property only, it tells us if the current state of the exercise is synced with the backend.
};

export type ErrorResponse<T = undefined> = {
  message: string;
  statusCode: number;
  type?: string;
  data?: T;
  fields?: string[];
};

export function isErrorResponse<T>(
  response: any
): response is ErrorResponse<T> {
  return response && response.message && response.statusCode;
}
