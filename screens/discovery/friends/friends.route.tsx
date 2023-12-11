import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { Layout } from "@/costants/Layout";
import { IApiUser } from "@/interfaces/users.interface";
import i18n from "@/lang";
import { useInfiniteFriendsQuery } from "@/queries/useInfiniteFriendsQuery";
import { RootState } from "@/redux/app/store";
import {
  Icon,
  Pressable,
  Spinner,
  Text,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { UserMinus2Icon } from "lucide-react-native";
import React from "react";
import { Alert, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

type Props = {
  goToProfile?: (item: IApiUser) => void;
};

const FriendsRoute = ({ goToProfile }: Props) => {
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
  } = useInfiniteFriendsQuery(tokenApi, isLoggedIn);

  const destroy = (userId: number, username: string) => {
    Alert.alert(
      i18n.t("unfriendUserAlert.title", {
        username: username,
      }),
      i18n.t("unfriendUserAlert.description", {
        username: username,
      }),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => {
            console.log("unfriend", userId);
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("FriendsRoute focused");
    }, [])
  );

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
        ListHeaderComponent={() => (
          <View marginVertical={20} backgroundColor="transparent">
            <Text fontFamily="Inter-SemiBold" fontSize="$sm" lineHeight="$sm">
              {i18n.t("friendsRoute.friends", {
                count:
                  data &&
                  data.pages &&
                  data.pages.length > 0 &&
                  data.pages[0].total &&
                  data.pages[0].total > 0
                    ? data.pages[0].total
                    : 0,
              })}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            flex={1}
            backgroundColor="transparent"
            key={item.id}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <UserItem user={item} onPress={() => goToProfile?.(item)} />
            <View
              height="100%"
              backgroundColor="transparent"
              alignItems="center"
              justifyContent="center"
            >
              <Pressable onPress={() => destroy(item.id, item.username)}>
                <Icon
                  as={UserMinus2Icon}
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
                {new Array(10).fill(0).map((_, index) => (
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

export default FriendsRoute;
