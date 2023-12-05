import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { View } from "@gluestack-ui/themed";
import { MainStackScreenProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FetchMe } from "@/api/routes/users.route";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FetchReceivedFriendRequestsCount } from "@/api/routes/friendships.route";
import AnimatedNavbar, {
  ANIMATED_NAVBAR_HEIGHT,
} from "@/components/home/animated_navbar/animated_navbar.component";
import HomeKeys from "./home.keys";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useMeQuery } from "@/queries/useMeQuery";

const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const insets = useSafeAreaInsets();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const translateY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const { data, isLoading } = useMeQuery(tokenApi, isLoggedIn);

  const {
    data: receivedFriendRequestsCount,
    refetch: receivedFriendRequestsCountRefetch,
  } = useQuery({
    queryKey: HomeKeys.receivedFriendRequestsCount,
    queryFn: () => FetchReceivedFriendRequestsCount(tokenApi),
    enabled: isLoggedIn,
    // staleTime: Infinity,
    // gcTime: Infinity,
  });

  useRefreshOnFocus(receivedFriendRequestsCountRefetch);

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
        username: data?.username,
      },
    });
  };

  const _onPressLeftIcon = () => {
    navigation.navigate("Discovery", {
      screen: "Search",
    });
  };

  return (
    <View flex={1} backgroundColor="transparent">
      <AnimatedNavbar
        animatedValue={translateY}
        avatarUrl={data?.profilePicture?.url}
        username={data?.username}
        fullname={data?.fullname}
        isLoadingMe={isLoading}
        onPressLeftIcon={_onPressLeftIcon}
        onPressRightIcon={_onPressRightIcon}
        pendingFriendRequestsCount={receivedFriendRequestsCount?.count}
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
              }}
            ></View>
          );
        }}
        // onRefresh={() => timelineRefetch()}
        // refreshing={timelineIsRefetching}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefetching}
        //     progressViewOffset={HEADER_HEIGHT + insets.top}
        //     onRefresh={() => refetch()}
        //   />
        // }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: ANIMATED_NAVBAR_HEIGHT + insets.top + 10,
        }}
        scrollEnabled={true}
      />
    </View>
  );
};

export default HomeScreen;
