import { UserProfileStackScreenProps } from "@/types";
import { Spinner, View } from "@gluestack-ui/themed";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { FlashList } from "@shopify/flash-list";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { useHeaderHeight } from "@react-navigation/elements";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { IApiUser } from "@/interfaces/users.interface";
import { useInfiniteMutualFriends } from "@/api/queries/useInfiniteMutualFriends";

const MutualFriendsScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"MutualFriends">) => {
  const insets = useSafeAreaInsets();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteMutualFriends(route.params.id, isLoggedIn, tokenApi);

  React.useEffect(() => {
    if (data && data.pages && data.pages.length > 0) {
      navigation.setParams({
        total: data.pages[0].total,
      });
    }
  }, [data]);

  const pushToUserProfile = (item: IApiUser) =>
    navigation.push("UserProfile", { ...item });

  const _onEndReached = () => hasNextPage && fetchNextPage();

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
          <UserItem
            user={item}
            key={index}
            onPress={() => pushToUserProfile(item)}
          />
        )}
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View flex={1} backgroundColor="transparent">
                {new Array(
                  route.params.total && route.params.total > 0
                    ? route.params.total
                    : Math.ceil(
                        (SCREEN_HEIGHT - useHeaderHeight()) /
                          USER_ITEM_MIN_HEIGHT
                      )
                )
                  .fill(0)
                  .map((_, index) => (
                    <UserItem isLoading key={index} />
                  ))}
              </View>
            );
          }
        }}
        onEndReachedThreshold={0.5}
        onEndReached={_onEndReached}
        ListFooterComponent={() =>
          isFetchingNextPage ? <Spinner size="small" /> : null
        }
      />
    </View>
  );
};

export default MutualFriendsScreen;
