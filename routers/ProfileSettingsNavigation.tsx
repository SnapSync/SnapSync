import translate from '@/helpers/localization';
import SettingsScreen from '@/screens/ProfileSettingsStack/SettingsScreen';
import { ProfileSettingsStackParamList } from '@/utils/Routes';
import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<ProfileSettingsStackParamList>();

const screenOptions: StackNavigationOptions = {
  gestureEnabled: false,
  headerShown: true,
  headerTitleAlign: 'center',
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: 'Inter_600SemiBold',
  },
};

const ProfileSettingsNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions }}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: translate('navigation.settings'),
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileSettingsNavigation;
