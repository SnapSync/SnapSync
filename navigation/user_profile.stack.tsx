import React from "react";
import { UserProfileStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "@/screens/user_profile/user_profile/user_profile.screen";
import MutualFriendsScreen from "@/screens/user_profile/mutual_friends/mutual_friends.screen";
import { ChevronLeftIcon, Icon, useColorMode } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import i18n from "@/lang";

const Stack = createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStack = () => {
  const colorMode = useColorMode();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        headerTitleAlign: "center",
        headerTitleStyle: {
          // fontFamily: "Inter-SemiBold",
        },
      }}
    >
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="MutualFriends"
        component={MutualFriendsScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: i18n.t("mutualFriendsScreen.screenTitle", {
            count: route.params?.total || 0,
          }),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                as={ChevronLeftIcon}
                size="xl"
                color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
