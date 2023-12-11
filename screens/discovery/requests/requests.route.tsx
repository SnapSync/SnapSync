import {
  Spinner,
  View,
  Text,
  Icon,
  useColorMode,
  Pressable,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import RequestsKeys from "./requests.keys";
import {
  FetchSentFriendRequestsCount,
  FetchUserReceivedFriendRequests,
} from "@/api/routes/friendships.route";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { FlashList } from "@shopify/flash-list";
import { Layout } from "@/costants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshControl, TouchableOpacity } from "react-native";
import { Clock1, UserX2Icon } from "lucide-react-native";
import i18n from "@/lang";
import { IApiUser } from "@/interfaces/users.interface";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  goToProfile?: (item: IApiUser) => void;
  onPressSentRequests: (total?: number) => void;
};

const RequestsRoute = ({ goToProfile, onPressSentRequests }: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const queryClient = useQueryClient();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: RequestsKeys.infiniteReceivedFriendRequests,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      FetchUserReceivedFriendRequests(pageParam, tokenApi),
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  const { data: sentFriendRequestsCount } = useQuery({
    queryKey: RequestsKeys.countSentFriendRequests,
    queryFn: () => FetchSentFriendRequestsCount(tokenApi),
    enabled: isLoggedIn,
    // staleTime: Infinity,
    // gcTime: Infinity,
  });

  useFocusEffect(
    React.useCallback(() => {
      console.log("Requests focused");
    }, [])
  );

  const reject = (userId: number) => {
    console.log("reject", userId);
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
        ListHeaderComponent={() => (
          <View marginVertical={20} backgroundColor="transparent">
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
              onPress={() =>
                onPressSentRequests(sentFriendRequestsCount?.count)
              }
            >
              <View backgroundColor="transparent" flex={1} gap={5}>
                <Text
                  fontFamily="Inter-SemiBold"
                  fontSize="$md"
                  lineHeight="$md"
                >
                  {i18n.t("requestsRoute.requestSentTitle")}
                </Text>
                <Text
                  fontFamily="Inter-Regular"
                  fontSize="$sm"
                  lineHeight="$sm"
                >
                  {i18n.t("requestsRoute.requestSentDescription")}
                </Text>
              </View>
              <Icon as={Clock1} size="md" />
            </TouchableOpacity>
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
              flexDirection="row"
              gap={10}
            >
              <Button
                action="secondary"
                variant="solid"
                size="sm"
                borderRadius="$3xl"
              >
                <ButtonText fontFamily="Inter-SemiBold" fontSize="$xs">
                  {i18n.t("userProfile.friendship.accept")}
                </ButtonText>
              </Button>
              <Pressable onPress={() => reject(item.id)}>
                <Icon
                  as={UserX2Icon}
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
                {new Array(
                  queryClient.getQueryData<{
                    message: string;
                    count: number;
                  }>(RequestsKeys.countReceivedFriendRequests)?.count || 5
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

export default RequestsRoute;
