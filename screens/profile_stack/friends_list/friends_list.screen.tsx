import { Alert, RefreshControl, StyleSheet } from "react-native";
import React from "react";
import { ProfileStackScreenProps } from "@/types";
import { Spinner, View, useColorMode, Text, Icon } from "@gluestack-ui/themed";
import { useInfiniteFriends } from "@/api/queries/useInfiniteFriends";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { FlashList } from "@shopify/flash-list";
import FriendsListKeys from "./friends_list.keys";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { IApiUser } from "@/interfaces/users.interface";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";
import { UserIcon } from "lucide-react-native";
import { SCREEN_HEIGHT } from "@/utils/helper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

type Props = ProfileStackScreenProps<"FriendsList">;

const FriendsListScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const colorMode = useColorMode();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const {
    data,
    refetch,
    isLoading,
    isError,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteFriends(isLoggedIn, tokenApi);

  React.useEffect(() => {
    // La invalido perche voglio che quando rietro di nuovo alla schermata degli amici refetchi i dati
    return () => {
      queryClient.removeQueries({
        queryKey: FriendsListKeys.infiniteFriendsList,
        exact: true,
      });
    };
  }, []);

  const _renderItem = React.useCallback(
    ({ item }: { item: IApiUser }) => {
      return (
        <UserItem
          user={item}
          onPress={goToUserProfile}
          fsBtn="unfried"
          onPressUnfriend={unfriend}
        />
      );
    },
    [data]
  );

  const goToUserProfile = (user?: IApiUser) => {
    if (!user) return;

    navigation.push("UserProfileStack", {
      screen: "UserProfile",
      params: {
        ...user,
      },
    });
  };

  const unfriend = (user: IApiUser) => {
    Alert.alert(
      i18n.t("unfriendUserAlert.title", {
        username: user.username,
      }),
      i18n.t("unfriendUserAlert.description", {
        username: user.username,
      }),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("remove"),
          style: "destructive",
          onPress: () => {
            // dismissAll();
            // destroyFriendshipMutation.mutate({ userId, tokenApi });
          },
        },
      ]
    );
  };

  const _onEndReached = () => hasNextPage && fetchNextPage();

  const _keyExtractor = (item: IApiUser) => item.id.toString();

  return (
    <View flex={1} backgroundColor="transparent">
      <FlashList
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
          backgroundColor: "transparent",
        }}
        data={data?.pages.map((page) => page.data).flat() ?? []}
        estimatedItemSize={USER_ITEM_MIN_HEIGHT}
        onEndReached={_onEndReached}
        onEndReachedThreshold={0.5}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ListFooterComponent={() =>
          isFetchingNextPage ? <Spinner size="small" /> : null
        }
        ListEmptyComponent={() => {
          if (isLoading) {
            return new Array(Math.ceil(10))
              .fill(0)
              .map((_, index) => <UserItem key={index} isLoading={true} />);
          } else if (isError) {
            return (
              <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                height={
                  SCREEN_HEIGHT - useBottomTabBarHeight() - useHeaderHeight()
                }
                backgroundColor="transparent"
              >
                <Text fontFamily="Inter_500Medium">
                  {i18n.t("errors.generic")}
                </Text>
              </View>
            );
          } else {
            return (
              <View
                flex={1}
                justifyContent="center"
                alignItems="center"
                backgroundColor={
                  colorMode === "dark"
                    ? "$backgroundDark700"
                    : "$backgroundLight200"
                }
                borderColor={
                  colorMode === "dark" ? "$borderDark400" : "$borderLight700"
                }
                borderWidth={1}
                borderRadius="$lg"
                paddingVertical="$6"
                paddingHorizontal="$4"
                gap="$5"
              >
                <Icon
                  as={UserIcon}
                  size="xl"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
                <Text
                  fontFamily="Inter_500Medium"
                  size="sm"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                >
                  {i18n.t("friendsListScreen.emptyList")}
                </Text>
              </View>
            );
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colorMode === "dark" ? "#FCFCFC" : "#171717"}
          />
        }
      />
    </View>
  );
};

export default FriendsListScreen;

const styles = StyleSheet.create({});
