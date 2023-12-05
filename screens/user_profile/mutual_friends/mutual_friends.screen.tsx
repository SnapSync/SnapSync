import { UserProfileStackScreenProps } from "@/types";
import { Spinner, View } from "@gluestack-ui/themed";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import mutualFriendsKeys from "./queries";
import { FetchMutualFriends } from "@/api/routes/friendships.route";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { FlashList } from "@shopify/flash-list";
import UserItem from "@/components/user_item/user_item.component";
import { useHeaderHeight } from "@react-navigation/elements";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";

const MutualFriendsScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"MutualFriends">) => {
  const insets = useSafeAreaInsets();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const { data, isLoading } = useInfiniteQuery({
    queryKey: mutualFriendsKeys.infiniteMutualFriends(route.params.id),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      FetchMutualFriends(route.params.id, pageParam, tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  React.useEffect(() => {
    if (data && data.pages && data.pages.length > 0) {
      navigation.setParams({
        total: data.pages[0].total,
      });
    }
  }, [data]);

  // useRefreshOnFocus(refetch); // Hook to refresh data on focus

  return (
    <View
      flex={1}
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      paddingBottom={insets.bottom}
    >
      <FlashList
        data={data?.pages.map((page) => page.data).flat()}
        estimatedItemSize={50}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <UserItem user={item} key={index} />}
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                backgroundColor="transparent"
                height={SCREEN_HEIGHT - useHeaderHeight()}
              >
                <Spinner size="small" />
              </View>
            );
          }
        }}
      />
    </View>
  );
};

export default MutualFriendsScreen;
