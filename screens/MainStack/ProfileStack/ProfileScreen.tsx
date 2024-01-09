import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useMe } from '@/modules/app/api/queries/useMe';
import { ProfileStackScreenProps } from '@/utils/Routes';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Divider,
  Icon,
  Pressable,
  ScrollView,
  Switch,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCogIcon, Verified } from 'lucide-react-native';
import { useThemedStyles } from '@/hooks';
import { ITheme } from '@/assets/Color/LightTheme';
import { useMyFriendsCount } from '@/modules/app/api/queries/useMyFriendsCount';
import Layout from '@/assets/Layout';
import { Skeleton } from 'moti/skeleton';
import { useAppDispatch, useAppSelector } from '@/utils/redux/store';
import translate from '@/helpers/localization';
import { SetColorShceme } from '@/modules/app/redux/appSlice';
import UserCounter from '@/modules/app/components/UserCounter';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from '@/modules/app/services/appService';

const AVATAR_SIZE = 96;

type Props = ProfileStackScreenProps<'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const ucm = useAppSelector((state) => state.AppReducer.userColorScheme);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const themedStyles = useThemedStyles<typeof styles>(styles);

  const { data, isLoading } = useMe();
  const { data: fCount } = useMyFriendsCount();

  React.useEffect(() => {
    if (data && data.result && data.result.username) {
      navigation.setParams({ username: data.result.username });
    }
  }, [data, navigation]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={goToProfileSettings}>
          <Icon as={UserCogIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const goFriendsList = () => navigation.navigate('FriendsList', { total: fCount?.result.count });

  const goToProfileSettings = () =>
    navigation.navigate('ProfileSettingsStack', {
      screen: 'Settings',
    });

  const _onToggle = (v: boolean) => {
    dispatch(SetColorShceme(v ? 'dark' : 'light'));
  };

  const logout = async () => {
    await signOut(queryClient);
  };

  const me = data?.result;
  const friendsCount = fCount?.result.count;
  const isDarkMode = ucm === 'dark';

  return (
    <ScrollView
      contentContainerStyle={{
        paddingLeft: insets.left + Layout.ScreenSpacingLeft,
        paddingRight: insets.right + Layout.ScreenSpacingRight,
        paddingTop: Layout.ScreenSpacingTop,
      }}>
      <VStack space="md" alignItems="center">
        {isLoading ? (
          <Skeleton
            radius="round"
            colorMode={isDarkMode ? 'dark' : 'light'}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
          />
        ) : (
          <Avatar size="xl">
            <AvatarFallbackText>{me?.username || me?.fullname}</AvatarFallbackText>
            {me?.profilePicture ? (
              <AvatarImage
                source={{
                  uri: me.profilePicture.url,
                }}
              />
            ) : null}
            {me?.isVerified ? (
              <AvatarBadge style={themedStyles.avatarBadge}>
                <Icon
                  as={Verified}
                  size="sm"
                  // color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
              </AvatarBadge>
            ) : null}
          </Avatar>
        )}

        {isLoading ? (
          <Skeleton colorMode={isDarkMode ? 'dark' : 'light'} height={40} width="100%" />
        ) : (
          <Text size="3xl" fontFamily="Inter_700Bold">
            {me?.fullname}
          </Text>
        )}

        <UserCounter
          friendsCount={friendsCount}
          streak={11000}
          snapsCount={12}
          isMyProfile
          onPressFriendsCount={goFriendsList}
        />

        {isLoading ? (
          <Skeleton colorMode={isDarkMode ? 'dark' : 'light'} height={20} width="100%" />
        ) : (
          <Text size="md" fontFamily="Inter_500Medium">
            {me?.biography}
          </Text>
        )}
      </VStack>

      <Switch value={ucm === 'dark'} onToggle={_onToggle} />
      <Button onPress={logout}>
        <ButtonText>Esci</ButtonText>
      </Button>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = (theme: ITheme) =>
  StyleSheet.create({
    headerSection: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    avatarBadge: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
  });
