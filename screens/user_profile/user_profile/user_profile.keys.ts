const UserProfileKeys = {
  userProfile: (id: number) => ["user-profile", id] as const,
  friendshipStatus: (id?: number) => ["friendship-status", id] as const,

  sendFriendhipRequests: (id?: number) =>
    ["send-friendship-requests", id] as const,
  destroyFriendhipRequests: (id?: number) =>
    ["destroy-friendship-requests", id] as const,
  acceptFriendhipRequests: (id?: number) =>
    ["accept-friendship-requests", id] as const,
  rejectFriendhipRequests: (id?: number) =>
    ["reject-friendship-requests", id] as const,
  blockUser: (id?: number) => ["block-user", id] as const,
};

export default UserProfileKeys;
