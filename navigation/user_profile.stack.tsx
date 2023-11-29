import React from "react";
import { UserProfileStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "@/screens/user_profile/user_profile/user_profile.screen";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";

const Stack = createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStack = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        initialParams={{
          id: userId ? userId : 0,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
