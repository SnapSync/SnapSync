import { DiscoveryStackParamList } from "@/types";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import IncomingFriendRequestsScreen from "@/screens/discovery_stack/incoming_friend_requests/incoming_friend_requests.screen";
import ForYouScreen from "@/screens/discovery_stack/for_you/for_you.screen";
import OutgoingFriendRequestsScreen from "@/screens/discovery_stack/outgoing_friend_requests/outgoing_friend_requests.screen";

const Tab = createMaterialTopTabNavigator<DiscoveryStackParamList>();

// const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

const DiscoveryStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="OutgoingFriendRequests"
        component={OutgoingFriendRequestsScreen}
      />
      <Tab.Screen
        name="IncomingFriendRequests"
        component={IncomingFriendRequestsScreen}
      />
      <Tab.Screen name="ForYou" component={ForYouScreen} />
    </Tab.Navigator>
  );

  // return (
  //   <Stack.Navigator
  //     screenOptions={{
  //       gestureEnabled: false,
  //       headerShown: true,
  //       headerShadowVisible: false,
  //       headerLeft: () => null,
  //       headerRight: () => null,
  //       headerBackVisible: false,
  //       headerTitleAlign: "center",
  //       headerTitleStyle: {
  //         ...Layout.HeaderTitleStyle,
  //       },
  //       headerTitle: i18n.t("discoveryScreen.screenTitle"),
  //     }}
  //   >
  //     <Stack.Screen name="Discovery" component={DiscoveryScreen} />
  //     <Stack.Group
  //       screenOptions={{ presentation: "modal", gestureEnabled: true }}
  //     >
  //       <Stack.Screen
  //         name="IncomingFriendRequests"
  //         component={IncomingFriendRequestsScreen}
  //         options={({ navigation, route }) => ({
  //           headerTitle: i18n.t("incomingFriendRequestsScreen.screenTitle", {
  //             count:
  //               route.params && route.params.total ? route.params.total : 0,
  //           }),

  //           headerLeft: () => (
  //             <TouchableOpacity onPress={() => navigation.goBack()}>
  //               <Icon
  //                 // as={Platform.OS === "ios" ? ChevronDownIcon : ChevronLeftIcon}
  //                 as={ChevronLeftIcon}
  //                 size="xl"
  //                 color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
  //               />
  //             </TouchableOpacity>
  //           ),
  //         })}
  //       />
  //     </Stack.Group>
  //   </Stack.Navigator>
  // );
};

export default DiscoveryStack;
