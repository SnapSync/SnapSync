import translate from '@/helpers/localization';
import MutualFriendsListScreen from '@/screens/UserProfileStack/MutualFriendsListScreen';
import UserProfileScreen from '@/screens/UserProfileStack/UserProfileScreen';
import { UserProfileStackParamList } from '@/utils/Routes';
import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';

const Stack = createStackNavigator<UserProfileStackParamList>();

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

const UserProfileNavigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={({ route }) => ({
          headerTitle: route.params?.username || '',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="MutualFriendsList"
        component={MutualFriendsListScreen}
        options={({ route }) => ({
          headerTitle:
            route.params && route.params.total !== undefined
              ? translate('navigation.mutualFriends', {
                  count: route.params.total,
                })
              : translate('navigation.fallbackMutualFriends'),
          // headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default UserProfileNavigation;
