import { UserSettingsStackParamList } from "@/types";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { ChevronLeftIcon, Icon, useColorMode } from "@gluestack-ui/themed";
import SettingsScreen from "@/screens/user_settings/settings/settings.screen";
import i18n from "@/lang";

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
    </Stack.Navigator>
  );
};

export default UserSettingsStack;
