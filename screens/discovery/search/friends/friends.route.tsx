import { Spinner, View, useColorMode } from "@gluestack-ui/themed";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import friendsKeys from "./queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { FetchUserFriends } from "@/api/routes/friendships.route";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { IApiUser } from "@/interfaces/users.interface";
import { FlashList } from "@shopify/flash-list";
import UserItem from "@/components/user_item/user_item.component";
import { SCREEN_HEIGHT } from "@/utils/helper";
import { Layout } from "@/costants/Layout";

type Props = {
  onPressUser?: (user: IApiUser) => void;
};

const FriendsRoute = ({ onPressUser }: Props) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery({
    queryKey: friendsKeys.infinite,
    initialPageParam: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isLoggedIn,
    // refetchOnWindowFocus: false,
    // refetchInterval: false,
    // refetchOnMount: false,
    // refetchIntervalInBackground: false,
    queryFn: async ({ pageParam }) => FetchUserFriends(pageParam, tokenApi),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <View
      style={[
        {
          flex: 1,
          paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: insets.right + Layout.DefaultMarginHorizontal,
        },
      ]}
    >
      <FlashList
        data={result.data?.pages.map((page) => page.data).flat()}
        estimatedItemSize={50}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onPress={() => onPressUser?.(item)}
            withDarkMode={colorMode === "dark" ? true : false}
            showUnfriendButton={true}
            // onPressUnfriend={() => unfriend(item.id, item.username)}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() =>
          result.isLoading && (
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center",
                height: SCREEN_HEIGHT - headerHeight,
              }}
            >
              <Spinner size="small" />
            </View>
          )
        }
        ListFooterComponent={() =>
          isFetchingNextPage && <Spinner size="small" />
        }
      />
    </View>
  );
};

export default FriendsRoute;
