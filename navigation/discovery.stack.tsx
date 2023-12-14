import { DiscoveryStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, TouchableOpacity } from "react-native";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Icon,
  useColorMode,
} from "@gluestack-ui/themed";
import SearchScreen from "@/screens/discovery/search/search.screen";
import { useNavigation } from "@react-navigation/native";
import i18n from "@/lang";
import DiscoveryScreen from "@/screens/discovery/discovery/discovery.screen";
import OutgoingFriendRequestsScreen from "@/screens/discovery/outgoing_friend_requests/outgoing_friend_requests.screen";
import IncomingFriendRequestsScreen from "@/screens/discovery/incoming_friend_requests/incoming_friend_requests.screen";

const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

const DiscoveryStack = () => {
  const colorMode = useColorMode();
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        gestureEnabled: false,
        headerShown: true,
        headerShadowVisible: false,
        // headerRight: () => (
        //   <TouchableOpacity onPress={goBack}>
        //     <Icon
        //       as={ChevronRightIcon}
        //       size="xl"
        //       color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
        //     />
        //   </TouchableOpacity>
        // ),
        headerLeft: () => null,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Inter_500Medium",
        },
        headerTitle: i18n.t("discovery.screenTitle"),
      })}
    >
      <Stack.Screen name="Discovery" component={DiscoveryScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Group
        screenOptions={{ presentation: "modal", gestureEnabled: true }}
      >
        <Stack.Screen
          name="OutgoingFriendRequests"
          component={OutgoingFriendRequestsScreen}
          options={({ navigation, route }) => ({
            headerTitle: i18n.t("outgoingFriendRequests.screenTitle"),
            headerRight: () => null,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  // as={Platform.OS === "ios" ? ChevronDownIcon : ChevronLeftIcon}
                  as={ChevronLeftIcon}
                  size="xl"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="IncomingFriendRequests"
          component={IncomingFriendRequestsScreen}
          options={({ navigation, route }) => ({
            headerTitle: i18n.t("incomingFriendRequestsScreen.screenTitle", {
              count:
                route.params && route.params.total ? route.params.total : 0,
            }),
            headerRight: () => null,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  // as={Platform.OS === "ios" ? ChevronDownIcon : ChevronLeftIcon}
                  as={ChevronLeftIcon}
                  size="xl"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default DiscoveryStack;
