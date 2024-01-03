import { ShowFriendship } from "@/api/routes/friendships.route";
import UserProfileKeys from "@/screens/user_profile/user_profile/user_profile.keys";
import { useQuery } from "@tanstack/react-query";

export function useFriendshipStatus(
  userId: number,
  enabled: boolean,
  tokenApi: string
) {
  return useQuery({
    queryKey: UserProfileKeys.friendshipStatus(userId),
    queryFn: () => ShowFriendship(userId, tokenApi),
    enabled: enabled,
    // staleTime: 1000 * 60 * 60, // 1 ora
    gcTime: Infinity,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
  });
}
