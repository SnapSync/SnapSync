export const ApiKeys = {
  me: ['me'] as const,
  myFriendsCount: ['me', 'friendsCount'] as const,
  myInfiniteFriendsList: ['me', 'infiniteFriendsList'] as const,

  // User from id
  userProfile: (id: number) => ['user', id] as const,

  // Friendships
  show: (id: number) => ['friendships', id] as const,
  infiniteMutualFriendsList: (id: number) =>
    ['friendships', id, 'infiniteMutualFriendsList'] as const,
};

export default ApiKeys;
