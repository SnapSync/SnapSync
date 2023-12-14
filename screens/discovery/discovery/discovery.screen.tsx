import React from "react";
import {
  View,
  useColorMode,
  Text,
  ScrollView,
  Button,
  ButtonText,
  Pressable,
  Icon,
  CloseIcon,
  ButtonSpinner,
  Spinner,
} from "@gluestack-ui/themed";
import i18n from "@/lang";
import { IApiUser } from "@/interfaces/users.interface";
import { DiscoveryStackScreenProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import UserItem from "@/components/user_item/user_item.component";
import { useInfiniteReceivedFriendRequestsQuery } from "@/queries/useInfiniteReceivedFriendRequestsQuery";
import { Alert } from "react-native";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import DiscoveryKeys from "./discovery.keys";
import {
  AcceptFriendRequest,
  DenyFriendRequest,
  FetchSuggestions,
  IResponseInfinite,
  SendFriendRequest,
} from "@/api/routes/friendships.route";
import UserProfileKeys from "@/screens/user_profile/user_profile/user_profile.keys";
import { IFriendshipStatus } from "@/interfaces/friendship_status.interface";
import ProfileKeys from "@/screens/profile/profile/profile.keys";
import Animated, { SlideOutLeft } from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

const DiscoveryScreen = ({
  navigation,
}: DiscoveryStackScreenProps<"Discovery">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const queryClient = useQueryClient();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const rejectFriendshipRequestMutation = useMutation({
    mutationFn: (data: { userId: number }) =>
      DenyFriendRequest(data.userId, tokenApi),
    onSuccess(data, variables, context) {
      // Aggiorno DiscoveryKeys.infiniteIncomingFriendRequests
      queryClient.setQueryData<InfiniteData<IResponseInfinite>>(
        DiscoveryKeys.infiniteIncomingFriendRequests,
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
      queryClient.setQueryData<IFriendshipStatus>(
        UserProfileKeys.friendshipStatus(variables.userId),
        {
          ...data,
          isNotSynced: false,
        }
      );
    },
  });

  const acceptFriendshipRequestMutation = useMutation({
    mutationFn: (data: { userId: number }) =>
      AcceptFriendRequest(data.userId, tokenApi),
    onSuccess(data, variables, context) {
      // Aggiorno DiscoveryKeys.infiniteIncomingFriendRequests
      queryClient.setQueryData<InfiniteData<IResponseInfinite>>(
        DiscoveryKeys.infiniteIncomingFriendRequests,
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

      // In case di successo aggiorno isNotSynced
      queryClient.setQueryData<IFriendshipStatus>(
        UserProfileKeys.friendshipStatus(variables.userId),
        {
          ...data,
          isNotSynced: false,
        }
      );

      // Refetch dei friends count
      queryClient.refetchQueries({
        queryKey: ProfileKeys.friendsCount,
        exact: true,
      });
    },
  });

  const sendFriendshipRequestMutation = useMutation({
    mutationFn: (data: { userId: number }) =>
      SendFriendRequest(data.userId, tokenApi),
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
      queryClient.setQueryData<IFriendshipStatus>(
        UserProfileKeys.friendshipStatus(variables.userId),
        {
          ...data,
          isNotSynced: false,
        }
      );
    },
  });

  const { data } = useInfiniteReceivedFriendRequestsQuery(tokenApi, isLoggedIn);

  const { data: peopleYouMayKnowData } = useQuery({
    queryKey: DiscoveryKeys.infinitePeopleYouMayKnow,
    queryFn: () => FetchSuggestions(tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const goToReceivedFriendRequests = () => {
    navigation.navigate("IncomingFriendRequests", {
      total: data && data.pages && data.pages[0] && data.pages[0].total,
    });
  };

  const reject = (userId: number) => {
    Alert.alert(
      i18n.t("rejectAlert.title"),
      i18n.t("rejectAlert.description"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("reject"),
          onPress: () => {
            rejectFriendshipRequestMutation.mutate({ userId });
          },
          style: "destructive",
        },
      ]
    );
  };

  const goToUserProfile = (user: IApiUser, from?: "incoming") => {
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: {
        ...user,
        friendshipLoader: from === "incoming" ? "incoming" : "add",
      },
    });
  };

  return (
    <View flex={1} backgroundColor="transparent">
      <View height={50} width="100%" backgroundColor="purple" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        backgroundColor="transparent"
      >
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          bgColor="transparent"
          width="$full"
        >
          <Text fontFamily="Inter_600SemiBold" size="md">
            Chi ti ha aggiunto
          </Text>
          <Button variant="link" onPress={goToReceivedFriendRequests}>
            <ButtonText fontFamily="Inter_600SemiBold">Vedi tutto</ButtonText>
          </Button>
        </View>
        {data?.pages[0]?.data.map((user: IApiUser) => (
          <View
            flexDirection="row"
            alignItems="center"
            key={user.id}
            backgroundColor="transparent"
          >
            <UserItem
              user={user}
              onPress={() => goToUserProfile(user, "incoming")}
            />
            <View
              backgroundColor="transparent"
              height="$full"
              flexDirection="row"
              gap="$2"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                size="sm"
                borderRadius="$full"
                disabled={
                  (rejectFriendshipRequestMutation.isPending ||
                    acceptFriendshipRequestMutation.isPending) &&
                  (rejectFriendshipRequestMutation.variables?.userId ===
                    user.id ||
                    acceptFriendshipRequestMutation.variables?.userId ===
                      user.id)
                }
                onPress={() =>
                  acceptFriendshipRequestMutation.mutate({
                    userId: user.id,
                  })
                }
              >
                {(rejectFriendshipRequestMutation.isPending ||
                  acceptFriendshipRequestMutation.isPending) &&
                (rejectFriendshipRequestMutation.variables?.userId ===
                  user.id ||
                  acceptFriendshipRequestMutation.variables?.userId ===
                    user.id) ? (
                  <ButtonSpinner size="small" />
                ) : (
                  <ButtonText>{i18n.t("accept")}</ButtonText>
                )}
              </Button>
              <Pressable
                onPress={() => reject(user.id)}
                disabled={
                  (rejectFriendshipRequestMutation.isPending ||
                    acceptFriendshipRequestMutation.isPending) &&
                  (rejectFriendshipRequestMutation.variables?.userId ===
                    user.id ||
                    acceptFriendshipRequestMutation.variables?.userId ===
                      user.id)
                }
              >
                {(rejectFriendshipRequestMutation.isPending ||
                  acceptFriendshipRequestMutation.isPending) &&
                (rejectFriendshipRequestMutation.variables?.userId ===
                  user.id ||
                  acceptFriendshipRequestMutation.variables?.userId ===
                    user.id) ? (
                  <Spinner size="small" />
                ) : (
                  <Icon
                    as={CloseIcon}
                    size="sm"
                    color={
                      colorMode === "dark" ? "$textDark0" : "$textLight950"
                    }
                  />
                )}
              </Pressable>
            </View>
          </View>
        ))}
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          bgColor="transparent"
          width="$full"
          marginTop="$6"
        >
          <Text fontFamily="Inter_600SemiBold" size="md">
            Suggerimenti per te
          </Text>
        </View>
        {peopleYouMayKnowData?.data.map((user: IApiUser) => (
          <AnimatedView
            flexDirection="row"
            alignItems="center"
            key={user.id}
            backgroundColor="transparent"
            // exiting={SlideOutLeft}
          >
            <UserItem user={user} onPress={() => goToUserProfile(user)} />
            <View
              backgroundColor="transparent"
              height="$full"
              flexDirection="row"
              gap="$2"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                size="sm"
                borderRadius="$full"
                disabled={
                  sendFriendshipRequestMutation.isPending &&
                  sendFriendshipRequestMutation.variables?.userId === user.id
                }
                onPress={() =>
                  sendFriendshipRequestMutation.mutate({
                    userId: user.id,
                  })
                }
              >
                {sendFriendshipRequestMutation.isPending &&
                sendFriendshipRequestMutation.variables?.userId === user.id ? (
                  <ButtonSpinner size="small" />
                ) : (
                  <ButtonText>{i18n.t("add")}</ButtonText>
                )}
              </Button>
            </View>
          </AnimatedView>
        ))}
      </ScrollView>
    </View>
  );
};

export default DiscoveryScreen;
