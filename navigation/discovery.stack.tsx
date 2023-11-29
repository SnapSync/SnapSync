import { DiscoveryStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { ChevronRightIcon, Icon, useColorMode } from "@gluestack-ui/themed";
import { Layout } from "@/costants/Layout";
import { Image } from "expo-image";
import SearchScreen from "@/screens/discovery/search/search.screen";
import OutgoingFriendRequestsScreen from "@/screens/discovery/outgoing_friend_requests/outgoing_friend_requests.screen";

const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

const DiscoveryStack = () => {
  const colorMode = useColorMode();

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        gestureEnabled: false,
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor:
            colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
        },
        headerTintColor: colorMode === "dark" ? "#FCFCFC" : "#171717",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
              else navigation.navigate("MainStack", { screen: "Home" });
            }}
          >
            <Icon
              as={ChevronRightIcon}
              size="xl"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          </TouchableOpacity>
        ),
        headerBackTitleVisible: false,
        headerLeft: () => null,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitle: () => (
          <Image
            source={{
              uri: "https://www.verysocialnetwork.com/.a/6a00e54f9b07dc883402a308e0cd67200c-800wi",
            }}
            style={{
              height: 40,
              width: 80,
            }}
          />
        ),
      })}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Group
        screenOptions={{ presentation: "modal", gestureEnabled: true }}
      >
        <Stack.Screen
          name="OutgoingFriendRequests"
          component={OutgoingFriendRequestsScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default DiscoveryStack;
