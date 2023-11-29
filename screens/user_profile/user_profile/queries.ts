const userProfileKeys = {
  userProfile: (id?: number) => ["user-profile", id] as const,
  friendshipStatus: (id?: number) => ["friendship-status", id] as const,

  sendFriendhipRequests: (id?: number) =>
    ["send-friendship-requests", id] as const,
};

export default userProfileKeys;
