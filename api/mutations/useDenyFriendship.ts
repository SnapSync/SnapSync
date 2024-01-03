import { DenyFriendRequest } from "@/api/routes/friendships.route";
import UserProfileKeys from "@/screens/user_profile/user_profile/user_profile.keys";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import IncomingFriendRequestsKeys from "@/screens/discovery/incoming_friend_requests/incoming_friend_requests.keys";
import { IApiUser } from "@/interfaces/users.interface";
import {
  FriendshipStatusResponse,
  InfiniteResponse,
} from "../api_responses.types";

export function useDenyFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number; tokenApi: string }) =>
      DenyFriendRequest(data.userId, data.tokenApi),
    onSuccess(data, variables, context) {
      // Aggiorno DiscoveryKeys.infiniteIncomingFriendRequests
      queryClient.setQueryData<InfiniteData<InfiniteResponse<IApiUser>>>(
        IncomingFriendRequestsKeys.infiniteReceivedFriendRequests,
        (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => {
                return {
                  ...page,
                  data: page.data.filter(
                    (user) => user.id !== variables.userId
                  ),
                };
              }),
            };
          }
        }
      );
      // Aggiorno il friendship status con quello che mi è tornato dal server
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
