import { UserSettingsStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  Icon,
  useColorMode,
} from "@gluestack-ui/themed";
import SettingsScreen from "@/screens/user_settings/settings/settings.screen";
import i18n from "@/lang";
import EditProfileScreen from "@/screens/user_settings/edit_profile/edit_profile.screen";
import BlockedUsersScreen from "@/screens/user_settings/blocked_users/blocked_users.screen";
import OtherScreen from "@/screens/user_settings/other/other.screen";
import TakeProfilePictureScreen from "@/screens/user_settings/take_profile_picture/take_profile_picture.screen";

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
          fontFamily: "Inter_500Medium",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => ({
          headerTitle: i18n.t("userSettingsScreen.screenTitle"),
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
          headerTitle: i18n.t("editProfileScreen.screenTitle"),
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
        name="TakeProfilePicture"
        component={TakeProfilePictureScreen}
        options={({ navigation, route }) => ({
          gestureEnabled: false,
          headerTitle: "",
          animation: "slide_from_bottom",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                as={ChevronDownIcon}
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
          headerTitle: i18n.t("otherScreen.screenTitle"),
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
          headerTitle: i18n.t("blockedUsersScreen.screenTitle"),
        })}
      />
    </Stack.Navigator>
  );
};

export default UserSettingsStack;
