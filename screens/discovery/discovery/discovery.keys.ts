const DiscoveryKeys = {
  search: (query: string) => ["search", { query }] as const,
  infinitePeopleYouMayKnow: ["infinitePeopleYouMayKnow"] as const,
};

export default DiscoveryKeys;
