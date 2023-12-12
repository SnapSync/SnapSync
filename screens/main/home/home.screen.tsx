import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { View, useColorMode } from "@gluestack-ui/themed";
import { MainStackScreenProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FetchReceivedFriendRequestsCount } from "@/api/routes/friendships.route";
import AnimatedNavbar, {
  ANIMATED_NAVBAR_HEIGHT,
} from "@/components/home/animated_navbar/animated_navbar.component";
import { useMeQuery } from "@/queries/useMeQuery";
import RequestsKeys from "@/screens/discovery/requests/requests.keys";
import { RefreshControl } from "react-native";

const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const translateY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const {
    data: me,
    isLoading,
    refetch,
    isRefetching,
  } = useMeQuery(tokenApi, isLoggedIn);

  const { data } = useQuery({
    queryKey: RequestsKeys.countReceivedFriendRequests,
    queryFn: () => FetchReceivedFriendRequestsCount(tokenApi),
    enabled: isLoggedIn,
    // staleTime: Infinity,
    // gcTime: Infinity,
  });

  // useRefreshOnFocus(receivedFriendRequestsCountRefetch);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = 0;
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = -ANIMATED_NAVBAR_HEIGHT - insets.top;
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: (e) => {
      isScrolling.value = true;
    },
    onEndDrag: (e) => {
      isScrolling.value = false;
    },
  });

  const _onPressRightIcon = () => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: {
        ...me,
      },
    });
  };

  const _onPressLeftIcon = () => {
    navigation.navigate("DiscoveryStack", {
      screen: "Discovery",
    });
  };

  return (
    <View flex={1} backgroundColor="transparent" justifyContent="center">
      <AnimatedNavbar
        animatedValue={translateY}
        avatarUrl={me?.profilePicture?.url}
        avatarBlurhash={me?.profilePicture?.blurHash}
        username={me?.username}
        fullname={me?.fullname}
        isLoadingMe={isLoading}
        onPressLeftIcon={_onPressLeftIcon}
        onPressRightIcon={_onPressRightIcon}
        pendingFriendRequestsCount={data?.count}
      />

      <Animated.FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: "100%",
                height: 100,
                backgroundColor: item % 2 === 0 ? "red" : "blue",
                marginBottom: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            progressViewOffset={ANIMATED_NAVBAR_HEIGHT + insets.top}
            onRefresh={() => refetch()}
            tintColor={colorMode === "dark" ? "#FCFCFC" : "#171717"}
          />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: ANIMATED_NAVBAR_HEIGHT + insets.top + 20,
        }}
        scrollEnabled={true}
      />
    </View>
  );
};

export default HomeScreen;
