import HomeScreen from "@/screens/main/home/home.screen";
import { MainStackParamList } from "@/types";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UserProfileStack from "./user_profile.stack";
import DiscoveryStack from "./discovery.stack";

const Tab = createMaterialTopTabNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 0, // Hide the tab bar
        },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Discovery" component={DiscoveryStack} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyUserProfile" component={UserProfileStack} />
    </Tab.Navigator>
  );
};

export default MainStack;
