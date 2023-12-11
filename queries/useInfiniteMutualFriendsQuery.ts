import { FetchMutualFriends } from "@/api/routes/friendships.route";
import MutualFriendsKeys from "@/screens/user_profile/mutual_friends/mutual_friends.keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteMutualFriendsQuery = (
  userId: number,
  tokenApi: string,
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: MutualFriendsKeys.infiniteMutualFriends(userId),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      FetchMutualFriends(userId, pageParam, tokenApi),
    enabled: enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
};
