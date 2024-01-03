import { SendFriendRequest } from "@/api/routes/friendships.route";
import DiscoveryKeys from "@/screens/discovery/discovery/discovery.keys";
import UserProfileKeys from "@/screens/user_profile/user_profile/user_profile.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IApiUser } from "@/interfaces/users.interface";
import { FriendshipStatusResponse } from "../api_responses.types";

export function useCreateFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number; tokenApi: string }) =>
      SendFriendRequest(data.userId, data.tokenApi),
    onSuccess(data, variables, context) {
      // Lo rimuovo da DiscoveryKeys.infinitePeopleYouMayKnow
      queryClient.setQueryData<{
        data: IApiUser[];
      }>(DiscoveryKeys.infinitePeopleYouMayKnow, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            data: oldData.data.filter((user) => user.id !== variables.userId),
          };
        }
      });

      // In case di successo aggiorno isNotSynced
      queryClient.setQueryData<FriendshipStatusResponse>(
        UserProfileKeys.friendshipStatus(variables.userId),
        {
          ...data,
          isNotSynced: false,
        }
      );
    },
  });
}
