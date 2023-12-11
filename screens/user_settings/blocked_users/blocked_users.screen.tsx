import { UserSettingsStackScreenProps } from "@/types";
import {
  Button,
  ButtonText,
  Spinner,
  View,
  useColorMode,
  Text,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import BlockedUsersKeys from "./blocked_users.keys";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { FetchUserBlockedUsers } from "@/api/routes/settings.route";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { Alert, RefreshControl } from "react-native";
import i18n from "@/lang";
import { useHeaderHeight } from "@react-navigation/elements";
import { SCREEN_HEIGHT } from "@/utils/helper";
import { IResponseInfinite, UnblockUser } from "@/api/routes/friendships.route";
import { IFriendshipStatus } from "@/interfaces/friendship_status.interface";
import UserProfileKeys from "@/screens/user_profile/user_profile/user_profile.keys";

const BlockedUsersScreen = ({
  navigation,
  route,
}: UserSettingsStackScreenProps<"BlockedUsers">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const queryClient = useQueryClient();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const unblockUserMutation = useMutation({
    mutationFn: (data: { userId: number }) =>
      UnblockUser(data.userId, tokenApi),
    onSuccess: (data, { userId }) => {
      // Rimuovo l'utente dalla lista senza dover fare il refetch
      queryClient.setQueryData<InfiniteData<IResponseInfinite>>(
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
      queryClient.setQueryData<IFriendshipStatus>(
        UserProfileKeys.friendshipStatus(userId),
        {
          ...data,
          isNotSynced: false,
        }
      );
    },
  });

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isError,
  } = useInfiniteQuery({
    queryKey: BlockedUsersKeys.infiniteBlockedUsers,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => FetchUserBlockedUsers(pageParam, tokenApi),
    enabled: isLoggedIn,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    refetchOnWindowFocus: "always",
  });

  const unblock = (userId: number, username: string) => {
    Alert.alert(
      i18n.t("unblockUserAlert.title", {
        username: username,
      }),
      i18n.t("unblockUserAlert.description", {
        username: username,
      }),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("unblock"),
          onPress: () => {
            unblockUserMutation.mutate({ userId });
          },
        },
      ]
    );
  };

  return (
    <View flex={1} backgroundColor="transparent">
      <FlashList
        data={data?.pages.map((page) => page.data).flat() || []}
        estimatedItemSize={USER_ITEM_MIN_HEIGHT}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
          paddingTop: 20,
        }}
        renderItem={({ item }) => (
          <View
            flex={1}
            backgroundColor="transparent"
            key={item.id}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <UserItem user={item} disabled />
            <View
              height="100%"
              backgroundColor="transparent"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                action="secondary"
                variant="solid"
                size="sm"
                borderRadius="$3xl"
                onPress={() => unblock(item.id, item.username)}
              >
                {unblockUserMutation.isPending &&
                unblockUserMutation.variables?.userId === item.id ? (
                  <ButtonSpinner size="small" />
                ) : (
                  <ButtonText fontFamily="Inter-SemiBold" fontSize="$xs">
                    {i18n.t("unblock")}
                  </ButtonText>
                )}
              </Button>
            </View>
          </View>
        )}
        ListEmptyComponent={() => {
          return (
            <View
              flex={1}
              backgroundColor="transparent"
              height={SCREEN_HEIGHT - useHeaderHeight() + 20} // 20 = padding top
              alignItems="center"
              justifyContent="center"
            >
              {isLoading ? (
                <Spinner size="small" />
              ) : isError ? (
                <Text
                  fontFamily="Inter-SemiBold"
                  fontSize="$sm"
                  lineHeight="$sm"
                  color={colorMode === "dark" ? "$red400" : "$red700"}
                >
                  {i18n.t("errors.generic")}
                </Text>
              ) : (
                <Text
                  fontFamily="Inter-SemiBold"
                  fontSize="$sm"
                  lineHeight="$sm"
                  // color={colorMode === "dark" ? "$red400" : "$red700"}
                >
                  {i18n.t("blockedUsers.noBlockedUsers")}
                </Text>
              )}
            </View>
          );
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={() =>
          isFetchingNextPage ? <Spinner size="small" /> : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colorMode === "dark" ? "#FCFCFC" : "#171717"}
          />
        }
      />
    </View>
  );
};

export default BlockedUsersScreen;
