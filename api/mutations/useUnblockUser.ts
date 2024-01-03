import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UnblockUser } from "../routes/friendships.route";
import { IApiUser } from "@/interfaces/users.interface";
import BlockedUsersKeys from "@/screens/user_settings/blocked_users/blocked_users.keys";
import UserProfileKeys from "@/screens/user_profile/user_profile/user_profile.keys";
import {
  FriendshipStatusResponse,
  InfiniteResponse,
} from "../api_responses.types";

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number; tokenApi: string }) =>
      UnblockUser(data.userId, data.tokenApi),
    onSuccess: (data, { userId }) => {
      // Rimuovo l'utente dalla lista senza dover fare il refetch
      queryClient.setQueryData<InfiniteData<InfiniteResponse<IApiUser>>>(
        BlockedUsersKeys.infiniteBlockedUsers,
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  data: page.data.filter((user) => user.id !== userId),
                };
              }),
            };
          }
        }
      );

      // Aggiorno il friendship status con il nuovo valore
      queryClient.setQueryData<FriendshipStatusResponse>(
        UserProfileKeys.friendshipStatus(userId),
        {
          ...data,
          isNotSynced: false,
        }
      );
    },
  });
}
