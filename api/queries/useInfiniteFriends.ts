import { FetchUserFriends } from "@/api/routes/friendships.route";
import FriendsListKeys from "@/screens/profile_stack/friends_list/friends_list.keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteFriends(enabled: boolean, tokenApi: string) {
  return useInfiniteQuery({
    queryKey: FriendsListKeys.infiniteFriendsList,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => FetchUserFriends(pageParam, tokenApi),
    enabled: enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
}
