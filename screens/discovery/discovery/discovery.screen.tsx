import React, { useState } from "react";
import { View, Divider, useColorMode, Text } from "@gluestack-ui/themed";
import { TabView } from "react-native-tab-view";
import type { Props as TabViewProps } from "react-native-tab-view/lib/typescript/src/TabView";
import TabBar from "@/components/discovery/tab_bar/tab_bar.component";
import i18n from "@/lang";
import FriendsRoute from "../friends/friends.route";
import { IApiUser } from "@/interfaces/users.interface";
import ForYouRoute from "../for_you/for_you.route";
import RequestsRoute from "../requests/requests.route";
import { DiscoveryStackScreenProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import DiscoveryKeys from "./discovery.keys";
import { SearchByQuery } from "@/api/routes/searches.route";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { SCREEN_HEIGHT } from "@/utils/helper";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";

const tabRoutes = [
  { key: "first", title: i18n.t("friends") },
  { key: "second", title: i18n.t("requests") },
  { key: "third", title: i18n.t("suggestions") },
] as const;

type TabRoutes = typeof tabRoutes;

type TabViewRoute = {
  key: TabRoutes[number]["key"];
  title: TabRoutes[number]["title"];
};

type RenderSceneProps = Parameters<
  TabViewProps<TabViewRoute>["renderScene"]
>[0];

const DiscoveryScreen = ({
  navigation,
}: DiscoveryStackScreenProps<"Discovery">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [index, setIndex] = useState(0);
  const [routes] = useState<TabViewRoute[]>(
    tabRoutes as unknown as TabViewRoute[]
  );
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  // Questa query non la cache perché è una ricerca, e non ha senso
  const { data, isLoading, refetch, isRefetching, isFetching } = useQuery({
    queryKey: DiscoveryKeys.search(query),
    queryFn: () => SearchByQuery(query, 1, tokenApi),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  React.useEffect(() => {
    const delayed = setTimeout(() => {
      if (query.trim().length > 0) {
        refetch();
      }
    }, 1000);

    return () => clearTimeout(delayed);
  }, [query]);

  const _goToProfile = (
    item: IApiUser,
    route: "friends" | "requests" | "forYou"
  ) => {
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: {
        ...item,
        friendshipLoader:
          route === "requests"
            ? "incoming"
            : route === "forYou"
            ? "add"
            : undefined,
      },
    });
  };

  const goToOutgoingRequests = (total?: number) => {
    navigation.navigate("OutgoingFriendRequests", { total: total });
  };

  const renderScene = ({ route }: RenderSceneProps) => {
    switch (route.key) {
      case "first":
        return (
          <FriendsRoute goToProfile={(item) => _goToProfile(item, "friends")} />
        );
      case "second":
        return (
          <RequestsRoute
            goToProfile={(item) => _goToProfile(item, "requests")}
            onPressSentRequests={goToOutgoingRequests}
          />
        );
      case "third":
        return (
          <ForYouRoute goToProfile={(item) => _goToProfile(item, "forYou")} />
        );
      default:
        return null;
    }
  };

  const _onChangeText = (text: string) => {
    setQuery(text);
  };

  const _onClear = () => {
    setQuery("");
  };

  const _onFocus = () => {
    setIsFocused(true);
  };

  const _onCancel = () => {
    setQuery("");
    setIsFocused(false);
  };

  const _onBlur = () => {
    setIsFocused(false);
  };

  // TODO: Da ottimizzare, poichè ogni volta che cambio da focused a blurred, viene ricaricato tutto

  return (
    <View flex={1} backgroundColor="transparent">
      <View
        backgroundColor="transparent"
        // marginTop={20}
        marginLeft={insets.left + Layout.ScreenPaddingHorizontal}
        marginRight={insets.right + Layout.ScreenPaddingHorizontal}
      >
        {/* <SearchBar
          // showCancel={true}
          // cancelButtonTitle={i18n.t("cancel")}
          containerStyle={{
            width: "100%",
          }}
          placeholder={i18n.t("discovery.placeholder")}
          inputStyle={{
            fontFamily: "Inter-Regular",
            fontSize: 14,
            color: colorMode === "light" ? "#171717" : "#FCFCFC",
          }}
          value={query}
          onChangeText={_onChangeText}
          onClear={_onClear}
          onFocus={_onFocus}
          onCancel={_onCancel}
          // onBlur={_onBlur}
          platform={"android"}
          autoCapitalize="none"
        /> */}
      </View>

      <Divider mt={20} />

      {isFocused ? (
        <View
          flex={1}
          alignItems="center"
          paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
          paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
        >
          {isRefetching || isFetching || isLoading ? (
            new Array(Math.ceil(SCREEN_HEIGHT / USER_ITEM_MIN_HEIGHT))
              .fill(0)
              .map((_, i) => <UserItem isLoading={true} key={i} />)
          ) : (
            <Text>{JSON.stringify(data, null, 2)}</Text>
          )}
        </View>
      ) : (
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          {/* <TabView<TabViewRoute>
            lazy
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => (
              <TabBar {...props} onIndexChange={setIndex} />
            )}
          /> */}
        </Animated.View>
      )}
    </View>
  );
};

export default DiscoveryScreen;
