import WelcomeScreen from "@/screens/OnboardingStack/WelcomeScreen";
import { OnboardingStackParamList } from "@/utils/Routes";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"Welcome"}
    >
      <Stack.Screen name={"Welcome"} component={WelcomeScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigation;
