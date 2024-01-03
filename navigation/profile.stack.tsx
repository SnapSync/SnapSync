import { ProfileStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "@/screens/profile_stack/profile/profile.screen";
import i18n from "@/lang";
import { StyleSheet } from "react-native";
import FriendsListScreen from "@/screens/profile_stack/friends_list/friends_list.screen";
import BackBtn from "@/components/back_btn/back_btn.component";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        gestureEnabled: false,
        headerShown: true,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerRight: () => null,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Inter_500Medium",
        },
      })}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerTitle:
            route.params?.username || i18n.t("profileScreen.screenTitle"),
          headerTitleStyle: {
            fontFamily: "Inter_600SemiBold",
          },
        })}
      />
      <Stack.Screen
        name="FriendsList"
        component={FriendsListScreen}
        options={({ navigation, route }) => ({
          headerTitle: i18n.t("friendsListScreen.screenTitle"),
          headerTitleStyle: {
            fontFamily: "Inter_500Medium",
          },
          headerLeft: () => <BackBtn onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
