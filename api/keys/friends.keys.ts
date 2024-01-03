const FriendsKeys = {
  countById: (id: number) => ["friends_count", id] as const,
  infinite: ["infinite_friends"] as const,
};

export default FriendsKeys;
