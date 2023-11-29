import { Layout } from "@/costants/Layout";
import { DiscoveryStackScreenProps } from "@/types";
import { SCREEN_WIDTH } from "@/utils/helper";
import { View, useColorMode } from "@gluestack-ui/themed";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import AnimatedTabBar from "@/components/search/animated_tabbar/animated_tabbar.component";
import FriendsRoute from "./friends/friends.route";
import RequestsRoute from "./requests/requests.route";
import SuggestionRoute from "./suggestions/suggestions.route";
import { IApiUser } from "@/interfaces/users.interface";
import AnimatedSearchBar from "@/components/animated_searchbar/animated_search_bar.component";
import i18n from "@/lang";

const SearchScreen = ({ navigation }: DiscoveryStackScreenProps<"Search">) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "friends" },
    { key: "requests" },
    { key: "suggestions" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    // Utilizzo un custom renderScene perchè mi servono delle props aggiuntive come onPressProfile
    switch (route.key) {
      case "friends":
        return <FriendsRoute onPressUser={goToUserProfile} />;
      case "requests":
        return (
          <RequestsRoute
            onPressUser={(user) => goToUserProfile(user, "incoming")}
            onPressFriendRequestsSent={goToOutgoingFriendRequests}
          />
        );
      case "suggestions":
        return <SuggestionRoute />;
      default:
        return null;
    }
  };

  const goToUserProfile = (user: IApiUser, screen?: "incoming") =>
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: { ...user, friendshipStatusLoaderVariant: screen },
    });

  const goToOutgoingFriendRequests = () =>
    navigation.navigate("OutgoingFriendRequests");

  return (
    <View flex={1}>
      <AnimatedSearchBar
        fullWidth={
          SCREEN_WIDTH -
          insets.left -
          insets.right -
          Layout.DefaultMarginHorizontal * 2
        }
        shrinkWidth={
          SCREEN_WIDTH -
          insets.left -
          insets.right -
          Layout.DefaultMarginHorizontal * 2 -
          90
        }
        onPressEnter={(text) => console.log(text)}
        withDarkMode={colorMode === "dark" ? true : false}
        placeholder={i18n.t("search.placeholder")}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        renderTabBar={() => null}
      />

      <AnimatedTabBar
        width={
          SCREEN_WIDTH -
          insets.left -
          insets.right -
          Layout.DefaultMarginHorizontal * 2
        }
        index={index}
        onChangeTab={setIndex}
        withDarkMode={colorMode === "dark" ? true : false}
      />
    </View>
  );
};

export default SearchScreen;
