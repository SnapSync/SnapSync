import React from "react";
import { ProfileStackScreenProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  Icon,
  Spinner,
  View,
  useColorMode,
  Text,
} from "@gluestack-ui/themed";
import { SCREEN_HEIGHT } from "@/utils/helper";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { Layout } from "@/costants/Layout";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import FriendsListKeys from "./friends_list.keys";
import { FetchUserFriends } from "@/api/routes/friendships.route";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, TouchableOpacity } from "react-native";
import i18n from "@/lang";
import { IApiUser } from "@/interfaces/users.interface";

const FriendsListScreen = ({
  navigation,
  route,
}: ProfileStackScreenProps<"FriendsList">) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const colorMode = useColorMode();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const {
    data,
    refetch,
    isLoading,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: FriendsListKeys.infiniteFriendsList,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => FetchUserFriends(pageParam, tokenApi),
    enabled: isLoggedIn,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goBack}>
          <Icon
            as={ChevronLeftIcon}
            size="xl"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    // La invalido perche voglio che quando rietro di nuovo alla schermata degli amici refetchi i dati
    return () => {
      queryClient.removeQueries({
        queryKey: FriendsListKeys.infiniteFriendsList,
        exact: true,
      });
    };
  }, []);

  const goBack = () => navigation.goBack();

  const goToUserProfile = (item: IApiUser) =>
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: {
        ...item,
      },
    });

  const _onEndReached = () => hasNextPage && fetchNextPage();

  return (
    <View flex={1} backgroundColor="transparent">
      <FlashList
        data={data?.pages.map((page) => page.data).flat()}
        estimatedItemSize={USER_ITEM_MIN_HEIGHT}
        onEndReached={_onEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({ item, index }) => (
          <UserItem
            key={index}
            user={item}
            onPress={() => goToUserProfile(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingTop: 20,
          paddingBottom: insets.bottom,
        }}
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isRefetching}
            tintColor={colorMode === "dark" ? "#FCFCFC" : "#171717"}
          />
        }
        ListHeaderComponent={() => {
          return (
            <View backgroundColor="transparent" width="100%" paddingBottom="$3">
              <Text fontFamily="Inter_600SemiBold" size="md">
                {i18n.t("friendsListScreen.count", {
                  count:
                    route.params &&
                    route.params.total &&
                    route.params.total >= 0
                      ? route.params.total
                      : data &&
                        data.pages &&
                        data.pages.length > 0 &&
                        data.pages[0].total >= 0
                      ? data.pages[0].total
                      : 0,
                })}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={() =>
          isFetchingNextPage ? <Spinner size="small" /> : null
        }
        ListEmptyComponent={() => {
          if (isLoading) {
            return new Array(Math.ceil(SCREEN_HEIGHT / USER_ITEM_MIN_HEIGHT))
              .fill(0)
              .map((_, index) => <UserItem key={index} isLoading={true} />);
          }
        }}
      />
    </View>
  );
};

export default FriendsListScreen;
