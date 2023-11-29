import { Platform, TouchableOpacity } from "react-native";
import React from "react";
import { DiscoveryStackScreenProps } from "@/types";
import {
  ChevronDownIcon,
  Icon,
  Spinner,
  useColorMode,
  View,
} from "@gluestack-ui/themed";
import { ChevronLeftIcon } from "lucide-react-native";
import i18n from "@/lang";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import outgoingFriendRequestsKeys from "./queries";
import { FetchUserSentFriendRequests } from "@/api/routes/friendships.route";
import { SCREEN_HEIGHT } from "@/utils/helper";
import UserItem from "@/components/user_item/user_item.component";
import { FlashList } from "@shopify/flash-list";
import { useHeaderHeight } from "@react-navigation/elements";
import { Layout } from "@/costants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OutgoingFriendRequestsScreen = ({
  navigation,
}: DiscoveryStackScreenProps<"OutgoingFriendRequests">) => {
  const colorMode = useColorMode();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

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
    queryKey: outgoingFriendRequestsKeys.infinite,
    initialPageParam: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isLoggedIn,
    // refetchOnWindowFocus: false,
    // refetchInterval: false,
    // refetchOnMount: false,
    // refetchIntervalInBackground: false,
    queryFn: async ({ pageParam }) =>
      FetchUserSentFriendRequests(pageParam, tokenApi),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: i18n.t("outgoingFriendRequests.screenTitle"),
      headerRight: () => null,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            as={Platform.OS === "ios" ? ChevronDownIcon : ChevronLeftIcon}
            size="xl"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const cancel = () => {};

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
            disabled
            withDarkMode={colorMode === "dark" ? true : false}
            showCancelRequestButton={true}
            onPressCancelRequest={cancel}
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

export default OutgoingFriendRequestsScreen;
