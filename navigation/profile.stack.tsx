import { ProfileStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { ChevronLeftIcon, Icon, useColorMode } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import ProfileScreen from "@/screens/profile/profile/profile.screen";
import { UserCog2Icon } from "lucide-react-native";
import FriendsListScreen from "@/screens/profile/friends_list/friends_list.screen";
import i18n from "@/lang";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  const colorMode = useColorMode();
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        gestureEnabled: false,
        headerShown: true,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
        },
      })}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerTitle: route.params?.username || "",
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
          // headerLeft: () => (
          //   <TouchableOpacity onPress={goBack}>
          //     <Icon
          //       as={ChevronLeftIcon}
          //       size="xl"
          //       color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          //     />
          //   </TouchableOpacity>
          // ),
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
