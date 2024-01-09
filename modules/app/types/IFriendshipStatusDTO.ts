export interface IFriendshipStatusDTO {
  isFriend: boolean;

  incomingRequest: boolean;
  outgoingRequest: boolean;

  isBlocking: boolean;

  isNotSynced?: boolean;
}
