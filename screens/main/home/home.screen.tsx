import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { View, useColorMode } from "@gluestack-ui/themed";
import { MainStackScreenProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FetchMe } from "@/api/routes/users.route";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FetchReceivedFriendRequestsCount } from "@/api/routes/friendships.route";
import AnimatedNavbar from "@/components/home/animated_navbar/animated_navbar.component";
import { HOME_NAVBAR_HEIGHT } from "./home.costants";
import homeKeys from "./queries";
import { Layout } from "@/costants/Layout";

const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const colorMode = useColorMode();

  const insets = useSafeAreaInsets();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const translateY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const { data } = useQuery({
    queryKey: homeKeys.me,
    queryFn: () => FetchMe(tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: true,
  });

  const { data: receivedFriendRequestsCount } = useQuery({
    queryKey: homeKeys.receivedFriendRequestsCount,
    queryFn: () => FetchReceivedFriendRequestsCount(tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: true,
  });

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
        translateY.value = -HOME_NAVBAR_HEIGHT - insets.top;
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
    if (!userId) return;
    navigation.navigate("MyUserProfile", {
      screen: "UserProfile",
      params: {
        id: userId,
        ...data,
      },
    });
  };

  const _onPressLeftIcon = () => {
    navigation.navigate("Discovery", {
      screen: "Search",
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedNavbar
        animatedValue={translateY}
        withDarkMode={colorMode === "dark" ? true : false}
        avatarUrl={data?.profilePicture?.url}
        username={data?.username}
        onPressLeftIcon={_onPressLeftIcon}
        onPressRightIcon={_onPressRightIcon}
        pendingFriendRequestsCount={receivedFriendRequestsCount?.count}
        containerStyle={{
          paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: insets.right + Layout.DefaultMarginHorizontal,
          paddingTop: insets.top,
        }}
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
                backgroundColor: "red",
                marginBottom: 10,
              }}
            />
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
          paddingTop: HOME_NAVBAR_HEIGHT + insets.top + 10,
        }}
        scrollEnabled={true}
      />
    </View>
  );
};

export default HomeScreen;
