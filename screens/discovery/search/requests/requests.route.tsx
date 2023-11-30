import React from "react";
import { useColorMode } from "@gluestack-style/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import requestsKeys from "./queries";
import {
  FetchSentFriendRequestsCount,
  FetchUserReceivedFriendRequests,
} from "@/api/routes/friendships.route";
import { Layout } from "@/costants/Layout";
import { Button, ButtonText, Spinner, View } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import UserItem from "@/components/user_item/user_item.component";
import { IApiUser } from "@/interfaces/users.interface";
import { SCREEN_HEIGHT } from "@/utils/helper";
import ListHeader from "@/components/requests/list_header/list_header.component";

type Props = {
  onPressUser?: (user: IApiUser) => void;
  onPressFriendRequestsSent?: () => void;
};

const RequestsRoute = ({ onPressUser, onPressFriendRequestsSent }: Props) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const { data } = useQuery({
    queryKey: requestsKeys.sentFriendRequestsCount,
    queryFn: () => FetchSentFriendRequestsCount(tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: true,
  });

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery({
    queryKey: requestsKeys.infiniteReceived,
    initialPageParam: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isLoggedIn,
    // refetchOnWindowFocus: false,
    // refetchInterval: false,
    // refetchOnMount: false,
    // refetchIntervalInBackground: false,
    queryFn: async ({ pageParam }) =>
      FetchUserReceivedFriendRequests(pageParam, tokenApi),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
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
            showAcceptRequestButton
            showCancelRequestButton
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingNextPage && <Spinner size="small" />
        }
        ListHeaderComponent={() => (
          <ListHeader
            onPress={() => onPressFriendRequestsSent?.()}
            count={data?.count}
            withDarkMode={colorMode === "dark" ? true : false}
          />
        )}
      />
    </View>
  );
};

export default RequestsRoute;
