import DiscoveryKeys from "@/screens/discovery/discovery/discovery.keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FetchUserReceivedFriendRequests } from "../routes/friendships.route";
import IncomingFriendRequestsKeys from "@/screens/discovery/incoming_friend_requests/incoming_friend_requests.keys";

export function useInfiniteIncominFriendshipRequests(
  enabled: boolean,
  tokenApi: string,

  size?: number,
  query?: string | null
) {
  return useInfiniteQuery({
    queryKey: IncomingFriendRequestsKeys.infiniteReceivedFriendRequests,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      FetchUserReceivedFriendRequests(pageParam, tokenApi, size, query),
    enabled: enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
}
