import {
  CloseCircleIcon,
  Icon,
  Pressable,
  Spinner,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import OutgoingFriendRequestsKeys from "./outgoing_friend_requests.keys";
import { FetchUserSentFriendRequests } from "@/api/routes/friendships.route";
import { FlashList } from "@shopify/flash-list";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { Layout } from "@/costants/Layout";
import { DiscoveryStackScreenProps } from "@/types";
import { RefreshControl } from "react-native";

const OutgoingFriendRequestsScreen = ({
  route,
}: DiscoveryStackScreenProps<"OutgoingFriendRequests">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: OutgoingFriendRequestsKeys.infiniteSentFriendRequests,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      FetchUserSentFriendRequests(pageParam, tokenApi),
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 60, // 1 ora
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  const cancel = (userId: number, username: string) => {
    console.log("cancel", userId, username);
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
        }}
        renderItem={({ item, index }) => (
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
              <Pressable onPress={() => cancel(item.id, item.username)}>
                <Icon
                  as={CloseCircleIcon}
                  size="sm"
                  color={colorMode === "dark" ? "$red400" : "$red700"}
                />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View flex={1} backgroundColor="transparent">
                {new Array(route.params?.total || 5).fill(0).map((_, index) => (
                  <UserItem isLoading key={index} />
                ))}
              </View>
            );
          }
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
            tintColor={colorMode === "dark" ? "#fff" : "#000"}
          />
        }
      />
    </View>
  );
};

export default OutgoingFriendRequestsScreen;
