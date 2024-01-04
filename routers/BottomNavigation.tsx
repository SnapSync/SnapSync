import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { Text, View, Appearance, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storeEnum } from "@/helpers/storage/Abstract";
import { removeStoreDataAsync } from "@/helpers/storage";
import { MainStackParamList } from "@/utils/Routes";

const Tab = createBottomTabNavigator<MainStackParamList>();

export default function TabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: theme.primary,
        // tabBarStyle: { backgroundColor: "#FFF" },
        headerShown: false,
      }}
      initialRouteName={"Home"}
    >
      <Tab.Screen
        name={"Home"}
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name={"Profile"}
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Home = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>{JSON.stringify(insets, null, 2)}</Text>
    </View>
  );
};

const Profile = () => {
  const theme = useTheme();

  const deleteP = async () => {
    await removeStoreDataAsync(storeEnum.ColorMode);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>{Appearance.getColorScheme()}</Text>
      <Text>{JSON.stringify(theme, null, 2)}</Text>

      <View style={{ height: 20, backgroundColor: "#E2E2E2" }} />

      <Button title="Cancella" onPress={deleteP} />
    </View>
  );
};
