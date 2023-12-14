import { FetchUserReceivedFriendRequests } from "@/api/routes/friendships.route";
import DiscoveryKeys from "@/screens/discovery/discovery/discovery.keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteReceivedFriendRequestsQuery = (
  tokenApi: string,
  enabled: boolean,
  size?: number,
  query?: string | null
) => {
  return useInfiniteQuery({
    queryKey: DiscoveryKeys.infiniteIncomingFriendRequests,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      FetchUserReceivedFriendRequests(pageParam, tokenApi, size, query),
    enabled: enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
};
