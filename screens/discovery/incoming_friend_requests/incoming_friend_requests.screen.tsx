import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { Layout } from "@/costants/Layout";
import { IApiUser } from "@/interfaces/users.interface";
import i18n from "@/lang";
import { useInfiniteReceivedFriendRequestsQuery } from "@/queries/useInfiniteReceivedFriendRequestsQuery";
import { RootState } from "@/redux/app/store";
import { DiscoveryStackScreenProps } from "@/types";
import {
  Button,
  ButtonText,
  CloseIcon,
  Icon,
  Pressable,
  Spinner,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const IncomingFriendRequestsScreen = ({
  route,
  navigation,
}: DiscoveryStackScreenProps<"IncomingFriendRequests">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteReceivedFriendRequestsQuery(tokenApi, isLoggedIn);

  React.useEffect(() => {
    if (data) {
      let total: number = 0;
      if (data && data.pages && data.pages.length > 0) {
        total = data.pages[0].total;
      }

      navigation.setParams({
        total,
      });
    }
  }, [data, navigation]);

  const _onEndReached = () => hasNextPage && fetchNextPage();

  const goToUserProfile = (user: IApiUser) => {
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: {
        ...user,
        friendshipLoader: "incoming",
      },
    });
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
            flexDirection="row"
            alignItems="center"
            key={item.id}
            backgroundColor="transparent"
          >
            <UserItem user={item} disabled />
            <View
              backgroundColor="transparent"
              height="$full"
              flexDirection="row"
              gap="$2"
              alignItems="center"
              justifyContent="center"
            >
              <Button size="sm" borderRadius="$full">
                <ButtonText>{i18n.t("accept")}</ButtonText>
              </Button>
              <Pressable>
                <Icon
                  as={CloseIcon}
                  size="sm"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
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
        onEndReached={_onEndReached}
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

export default IncomingFriendRequestsScreen;
