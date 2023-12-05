import { DiscoveryStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { ChevronRightIcon, Icon, useColorMode } from "@gluestack-ui/themed";
import { Layout } from "@/costants/Layout";
import { Image } from "expo-image";
import SearchScreen from "@/screens/discovery/search/search.screen";
import { useNavigation } from "@react-navigation/native";

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
        headerRight: () => (
          <TouchableOpacity onPress={goBack}>
            <Icon
              as={ChevronRightIcon}
              size="xl"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          </TouchableOpacity>
        ),
        headerLeft: () => null,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitle: "",
      })}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
      {/* <Stack.Group
        screenOptions={{ presentation: "modal", gestureEnabled: true }}
      >
        <Stack.Screen
          name="OutgoingFriendRequests"
          component={OutgoingFriendRequestsScreen}
        />
      </Stack.Group> */}
    </Stack.Navigator>
  );
};

export default DiscoveryStack;
