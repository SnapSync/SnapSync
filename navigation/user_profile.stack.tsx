import React from "react";
import { UserProfileStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "@/screens/user_profile/user_profile/user_profile.screen";

const Stack = createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
