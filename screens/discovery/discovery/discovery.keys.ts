const DiscoveryKeys = {
  search: (query: string) => ["search", query],
  infiniteIncomingFriendRequests: ["infiniteIncomingFriendRequests"] as const,
  infinitePeopleYouMayKnow: ["infinitePeopleYouMayKnow"] as const,
};

export default DiscoveryKeys;
