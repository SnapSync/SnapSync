import { useQuery } from "@tanstack/react-query";
import { FetchUserFriendsCount } from "../routes/friendships.route";
import FriendsListKeys from "@/screens/profile_stack/friends_list/friends_list.keys";

export function useFriendsCount(enabled: boolean, tokenApi: string) {
  return useQuery({
    queryKey: FriendsListKeys.countFriends,
    queryFn: () => FetchUserFriendsCount(tokenApi),
    enabled,
    // staleTime: 1000 * 60 * 5, // 5 minuti -> dopo il dato viene considerato vecchio, perciò viene rifetchato quando si entra nella schermata
    gcTime: Infinity,
    staleTime: Infinity,
  });
}
