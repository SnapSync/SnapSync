import { FetchUserFriends } from "@/api/routes/friendships.route";
import FriendsKeys from "@/screens/discovery/friends/friends.keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteFriendsQuery = (
  tokenApi: string,
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: FriendsKeys.infiniteFriends,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => FetchUserFriends(pageParam, tokenApi),
    enabled: enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
};
