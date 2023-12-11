import { UserSettingsStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { ChevronLeftIcon, Icon, useColorMode } from "@gluestack-ui/themed";
import SettingsScreen from "@/screens/user_settings/settings/settings.screen";
import i18n from "@/lang";
import EditProfileScreen from "@/screens/user_settings/edit_profile/edit_profile.screen";
import BlockedUsersScreen from "@/screens/user_settings/blocked_users/blocked_users.screen";
import OtherScreen from "@/screens/user_settings/other/other.screen";

const Stack = createNativeStackNavigator<UserSettingsStackParamList>();

const UserSettingsStack = () => {
  const colorMode = useColorMode();

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: true,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerBackVisible: false,
        headerTitleStyle: {
          fontFamily: "Inter-SemiBold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => ({
          headerTitle: i18n.t("userSettings.screenTitle"),
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
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ navigation, route }) => ({
          gestureEnabled: false,
          headerTitle: i18n.t("editProfile.screenTitle"),
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
      <Stack.Screen
        name="Other"
        component={OtherScreen}
        options={({ navigation, route }) => ({
          gestureEnabled: false,
          headerTitle: i18n.t("other.screenTitle"),
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
      <Stack.Screen
        name="BlockedUsers"
        component={BlockedUsersScreen}
        options={({ navigation, route }) => ({
          gestureEnabled: false,
          headerTitle: i18n.t("blockedUsers.screenTitle"),
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

export default UserSettingsStack;
