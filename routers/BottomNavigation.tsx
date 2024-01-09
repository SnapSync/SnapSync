import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storeEnum } from '@/helpers/storage/Abstract';
import { removeStoreDataAsync } from '@/helpers/storage';
import { MainStackParamList } from '@/utils/Routes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { myFriendsCount } from '@/modules/app/api';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonSpinner,
  ButtonText,
  Icon,
  Text,
} from '@gluestack-ui/themed';
import { signOut } from '@/modules/app/services/appService';
import HomeScreen from '@/screens/MainStack/HomeScreen';
import { useMe } from '@/modules/app/api/queries/useMe';
import ProfileNavigation from './ProfileNavigation';

const Tab = createBottomTabNavigator<MainStackParamList>();

export default function TabNavigator() {
  const { data } = useMe();

  const me = data?.result;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          display: 'none',
        },
      }}
      initialRouteName={'Home'}>
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon as={HomeIcon} size="md" color={color} />,
        }}
      />

      <Tab.Screen
        name={'ProfileStack'}
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ focused, color }) => {
            return (
              <View
                style={{
                  backgroundColor: focused ? color : 'transparent',
                  borderRadius: 9999,
                  padding: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Avatar size="xs">
                  <AvatarFallbackText>{me?.username || me?.fullname}</AvatarFallbackText>
                  {me?.profilePicture ? (
                    <AvatarImage
                      source={{
                        uri: me.profilePicture.url,
                      }}
                    />
                  ) : null}
                </Avatar>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const Profile = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data, refetch, isRefetching } = useQuery({
    queryKey: ['friends_count'],
    queryFn: myFriendsCount,
    enabled: false,
  });

  const logOut = async () => {
    await signOut(queryClient);
  };

  const deleteP = async () => {
    await removeStoreDataAsync(storeEnum.ColorMode);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Button onPress={() => refetch()}>
        {isRefetching ? <ButtonSpinner /> : <ButtonText>refetch</ButtonText>}
      </Button>
      <Button onPress={logOut}>
        {isRefetching ? <ButtonSpinner /> : <ButtonText>Log Out</ButtonText>}
      </Button>

      <Text>{JSON.stringify(data, null, 2)}</Text>

      {/* <Button title="Cancella" onPress={deleteP} /> */}
    </View>
  );
};
