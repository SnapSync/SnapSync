import translate from '@/helpers/localization';
import FriendsListScreen from '@/screens/MainStack/ProfileStack/FriendsListScreen';
import ProfileScreen from '@/screens/MainStack/ProfileStack/ProfileScreen';
import { ProfileStackParamList } from '@/utils/Routes';
import { Icon, ThreeDotsIcon } from '@gluestack-ui/themed';
import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { UserCogIcon } from 'lucide-react-native';
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator<ProfileStackParamList>();

const screenOptions: StackNavigationOptions = {
  gestureEnabled: true,
  gestureResponseDistance: Dimensions.get('screen').width,
  headerShown: true,
  headerTitleAlign: 'center',
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: 'Inter_600SemiBold',
  },
};

const ProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation, route }) => ({
          headerTitle: route.params?.username || translate('navigation.profile'),
        })}
      />
      <Stack.Screen
        name="FriendsList"
        component={FriendsListScreen}
        options={({ navigation, route }) => ({
          headerTitle: `${translate('navigation.friends')} ${
            route.params?.total ? `(${route.params?.total})` : ''
          }`,
          // headerLeft: () => ()
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
