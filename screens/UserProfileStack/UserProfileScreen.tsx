import { Alert, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import { FriendshipLoader, UserProfileStackScreenProps } from '@/utils/Routes';
import {
  AddIcon,
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  CloseIcon,
  HStack,
  Icon,
  ScrollView,
  Text,
  ThreeDotsIcon,
  VStack,
  View,
} from '@gluestack-ui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '@/assets/Layout';
import { useQuery } from '@tanstack/react-query';
import ApiKeys from '@/modules/app/api/queries/apiKeys';
import { getUserProfile } from '@/modules/app/api';
import { useAppSelector } from '@/utils/redux/store';
import { useShowFriendship } from '@/modules/app/api/queries/useShowFriendship';
import { Skeleton } from 'moti/skeleton';
import { useRefreshOnFocus, useTheme } from '@/hooks';
import { useInfiniteMutualFriendsList } from '@/modules/app/api/queries/useInfiniteMutualFriendsList';
import { ColorSchemeName } from 'react-native/Libraries/Utilities/Appearance';
import { IResponseInfiniteDTO } from '@/modules/app/types/IResponseInfiniteDTO';
import { IUserDTO } from '@/modules/app/types/IUserDTO';
import translate from '@/helpers/localization';
import UserCounter from '@/modules/app/components/UserCounter';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { IFriendshipStatusDTO } from '@/modules/app/types/IFriendshipStatusDTO';
import {
  AlertTriangleIcon,
  BanIcon,
  Share2Icon,
  UserCheck2Icon,
  UserMinus2Icon,
  Verified,
} from 'lucide-react-native';
import BottomSheetItem from '@/modules/app/components/BottomSheetItem';
import {
  useAcceptFriendship,
  useCreateFriendship,
  useDestroyFriendship,
  useRejectFriendship,
} from '@/modules/app/api/mutations/useFriendship';

const AVATAR_SIZE = 96;

type Props = UserProfileStackScreenProps<'UserProfile'>;

const UserProfileScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const isSignedIn = useAppSelector((state) => state.AppReducer.isSignedIn);
  const ucm = useAppSelector((state) => state.AppReducer.userColorScheme);
  const tokenData = useAppSelector((state) => state.AppReducer.tokenData);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const id = route.params && route.params.id ? route.params.id : 0; // If id is undefined, set it to 0

  const { data, isLoading, refetch } = useQuery({
    queryKey: ApiKeys.userProfile(id),
    queryFn: () => getUserProfile(id),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isSignedIn && tokenData && id > 0, // !!id is to prevent query from running when id is undefined
  });
  useRefreshOnFocus(refetch);

  const { data: fs, isLoading: isLoadingFs, refetch: refetchFs } = useShowFriendship(id);
  useRefreshOnFocus(refetchFs);

  const { data: mfs, isLoading: isMfsLoading } = useInfiniteMutualFriendsList(id, 3);

  const createFriendshipMutation = useCreateFriendship();
  const cancelFriendshipMutation = useDestroyFriendship();
  const acceptFriendshipMutation = useAcceptFriendship();
  const rejectFriendshipMutation = useRejectFriendship();
  const destroyFriendshipMutation = useDestroyFriendship();

  React.useEffect(() => {
    if (data && data.result && data.result.username) {
      navigation.setParams({ username: data.result.username });
    }

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity disabled={!data || !fs} onPress={handlePresentModalPress}>
          <Icon as={ThreeDotsIcon} size="md" />
        </TouchableOpacity>
      ),
    });
  }, [data, navigation, fs]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const goToReportUser = useCallback(() => {
    if (!data || !data.result) return;
    navigation.navigate('ReportUser', {
      ...data.result,
    });
  }, [navigation, data]);

  const goToMutualFriendsList = useCallback(() => {
    if (!id) return;
    navigation.navigate('MutualFriendsList', {
      id: id,
      total: mfs?.pages?.[0]?.result?.total,
    });
  }, [navigation, mfs, id]);

  const createFriendship = () => {
    if (!id || id <= 0) return;

    createFriendshipMutation.mutate({ userId: id });
  };

  const cancelFriendship = () => {
    if (!id || id <= 0) return;

    cancelFriendshipMutation.mutate({ userId: id });
  };

  const acceptFriendship = () => {
    if (!id || id <= 0) return;

    acceptFriendshipMutation.mutate({ userId: id });
  };

  const rejectFriendship = () => {
    if (!id || id <= 0) return;

    rejectFriendshipMutation.mutate({ userId: id });
  };

  const unfried = () => {
    if (!id || id <= 0) return;

    Alert.alert(
      translate('alerts.unfriend.title', {
        username: data?.result.username || route.params?.username,
      }),
      translate('alerts.unfriend.message'),
      [
        {
          text: 'Annulla',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Rimuovi',
          onPress: () => console.log('OK Pressed'),
          style: 'destructive',
        },
      ],
    );
  };

  const isDark = ucm === 'dark';

  const username = data ? data.result.username : route.params?.username;
  const fullname = data ? data.result.fullname : route.params?.fullname;
  const biography = data ? data.result.biography : route.params?.biography;
  const profilePicture = data ? data.result.profilePicture : route.params?.profilePicture;
  const isVerified = data ? data.result.isVerified : route.params?.isVerified;

  if (!id || id <= 0) {
    return (
      <View style={styles.errorContainer}>
        <Text size="sm" fontFamily="Inter_400Regular">
          {translate('generalErrorText')}
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + Layout.ScreenSpacingLeft,
          paddingRight: insets.right + Layout.ScreenSpacingRight,
          paddingTop: Layout.ScreenSpacingTop,
        }}>
        <VStack space="md" alignItems="center">
          {profilePicture !== undefined ? (
            <Avatar size="xl">
              <AvatarFallbackText>{username || fullname}</AvatarFallbackText>
              {profilePicture && (
                <AvatarImage
                  source={{
                    uri: profilePicture.url,
                  }}
                />
              )}
              {isVerified && !isLoading && (
                <AvatarBadge
                  style={{
                    backgroundColor: theme.background,
                  }}>
                  <Icon as={Verified} size="sm" />
                </AvatarBadge>
              )}
            </Avatar>
          ) : (
            isLoading && (
              <Skeleton
                radius="round"
                colorMode={isDark ? 'dark' : 'light'}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
              />
            )
          )}

          {fullname ? (
            <Text size="3xl" fontFamily="Inter_700Bold">
              {fullname}
            </Text>
          ) : (
            isLoading && <Skeleton colorMode={isDark ? 'dark' : 'light'} height={40} width="100%" />
          )}

          <UserCounter
            friendsCount={mfs?.pages?.[0]?.result?.total}
            streak={1}
            snapsCount={1000}
            onPressFriendsCount={goToMutualFriendsList}
          />

          <FriendshipStatus
            isLoading={isLoadingFs}
            status={fs?.result}
            colorMode={ucm}
            loaderType={route.params?.fsLoader}
            username={data?.result.username || route.params?.username}
            onPressAdd={createFriendship}
            isLoadingAdd={createFriendshipMutation.isPending}
            onPressCancel={cancelFriendship}
            isLoadingCancel={cancelFriendshipMutation.isPending}
            onPressAccept={acceptFriendship}
            isLoadingAccept={acceptFriendshipMutation.isPending}
            onPressReject={rejectFriendship}
            isLoadingReject={rejectFriendshipMutation.isPending}
          />

          <Text>{JSON.stringify(fs, null, 2)}</Text>

          <SocialContext
            colorMode={ucm}
            isLoading={isMfsLoading}
            result={mfs?.pages?.[0]?.result}
          />

          {biography ? (
            <Text size="md" fontFamily="Inter_500Medium">
              {biography}
            </Text>
          ) : (
            isLoading && <Skeleton colorMode={isDark ? 'dark' : 'light'} height={20} width="100%" />
          )}
        </VStack>
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.bottomSheet.backgroundColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.bottomSheet.handleIndicatorColor,
        }}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <BottomSheetItem
            label={translate('share')}
            iconAs={Share2Icon}
            onPress={() => console.log('Condividi')}
          />
          {fs?.result?.isFriend ? (
            <BottomSheetItem
              label={translate('removeFromFriends')}
              iconAs={UserMinus2Icon}
              variant="danger"
              onPress={unfried}
              disabled={destroyFriendshipMutation.isPending}
            />
          ) : null}
          {!fs?.result?.isBlocking ? (
            <BottomSheetItem
              label={translate('block')}
              iconAs={BanIcon}
              variant="danger"
              onPress={() => console.log('Blocca')}
            />
          ) : null}

          <BottomSheetItem
            label={translate('report')}
            iconAs={AlertTriangleIcon}
            variant="danger"
            onPress={goToReportUser}
          />
        </View>
      </BottomSheetModal>
    </>
  );
};

export default UserProfileScreen;

const FriendshipStatus = ({
  isLoading,

  onPressAdd,
  isLoadingAdd,

  onPressCancel,
  isLoadingCancel,

  onPressAccept,
  isLoadingAccept,

  onPressReject,
  isLoadingReject,

  loaderType,
  colorMode,
  status,
  username,
}: {
  isLoading: boolean;

  onPressAdd?: () => void;
  isLoadingAdd?: boolean;

  onPressCancel?: () => void;
  isLoadingCancel?: boolean;

  onPressAccept?: () => void;
  isLoadingAccept?: boolean;

  onPressReject?: () => void;
  isLoadingReject?: boolean;

  loaderType?: FriendshipLoader;
  colorMode?: ColorSchemeName;
  status?: IFriendshipStatusDTO;
  username?: string;
}) => {
  const LgHeight = 44;
  const MdHeight = 40;
  const SmTextHeight = 20;

  const handleAddUserPress = useCallback(() => {
    if (onPressAdd) onPressAdd();
  }, []);

  if (isLoading) {
    if (loaderType === 'add' || loaderType === 'outgoing') {
      return (
        <Skeleton
          colorMode={colorMode === 'dark' ? 'dark' : 'light'}
          height={LgHeight}
          width="100%"
        />
      );
    }

    if (loaderType === 'incoming') {
      return (
        <VStack
          space="md"
          alignItems="center"
          backgroundColor="transparent"
          padding="$4"
          borderColor={colorMode === 'dark' ? '$borderDark700' : '$borderLight400'}
          borderWidth={1}
          borderRadius="$2xl">
          <Skeleton
            colorMode={colorMode === 'dark' ? 'dark' : 'light'}
            height={SmTextHeight}
            width="100%"
          />

          <HStack
            space="md"
            backgroundColor="transparent"
            width="$full"
            alignItems="center"
            justifyContent="center">
            {new Array(2).fill(0).map((_, i) => (
              <View backgroundColor="transparent" flex={1} key={i}>
                <Skeleton
                  colorMode={colorMode === 'dark' ? 'dark' : 'light'}
                  height={MdHeight}
                  width="100%"
                />
              </View>
            ))}
          </HStack>
        </VStack>
      );
    }

    return null;
  }

  if (!status || status.isBlocking || status.isFriend) return null;

  if (status.incomingRequest) {
    return (
      <VStack
        space="md"
        alignItems="center"
        backgroundColor="transparent"
        padding="$4"
        borderColor={colorMode === 'dark' ? '$borderDark700' : '$borderLight400'}
        borderWidth={1}
        borderRadius="$2xl">
        <Text size="sm" fontFamily="Inter_500Medium">
          {translate('friendRequestFrom', { username })}
        </Text>
        <HStack
          space="md"
          backgroundColor="transparent"
          width="$full"
          alignItems="center"
          justifyContent="center">
          <Button
            size="md"
            variant="solid"
            action="secondary"
            onPress={onPressAccept}
            disabled={isLoadingAccept || isLoadingReject}>
            {isLoadingAccept || isLoadingReject ? (
              <ButtonSpinner />
            ) : (
              <>
                <ButtonIcon as={UserCheck2Icon} />
                <ButtonText> {translate('accept')}</ButtonText>
              </>
            )}
          </Button>
          <Button
            size="md"
            variant="outline"
            action="secondary"
            onPress={onPressReject}
            disabled={isLoadingAccept || isLoadingReject}>
            {isLoadingAccept || isLoadingReject ? (
              <ButtonSpinner />
            ) : (
              <>
                <ButtonIcon as={UserMinus2Icon} />
                <ButtonText> {translate('decline')}</ButtonText>
              </>
            )}
          </Button>
        </HStack>
      </VStack>
    );
  }

  if (status.outgoingRequest) {
    return (
      <Button
        size="lg"
        variant="solid"
        action="secondary"
        width="100%"
        onPress={onPressCancel}
        isDisabled={isLoadingCancel}>
        {isLoadingCancel ? (
          <ButtonSpinner />
        ) : (
          <>
            <ButtonIcon as={CloseIcon} />
            <ButtonText> {translate('cancelRequest')}</ButtonText>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant="solid"
      action="secondary"
      width="100%"
      onPress={handleAddUserPress}
      disabled={isLoadingAdd}>
      {isLoadingAdd ? (
        <ButtonSpinner />
      ) : (
        <>
          <ButtonIcon as={AddIcon} />
          <ButtonText> {translate('addFriend')}</ButtonText>
        </>
      )}
    </Button>
  );
};

const SocialContext = ({
  isLoading,
  colorMode,
  result,
}: {
  isLoading: boolean;

  colorMode?: ColorSchemeName;
  result?: IResponseInfiniteDTO<IUserDTO>;
}) => {
  const AvatarSmSize = 32;
  const TextSmHeight = 20;

  const usersToDisplay = React.useMemo(() => {
    if (!result) return [];
    return result.data.slice(0, 3);
  }, [result]);

  const extraUsers = React.useMemo(() => {
    if (!result) return 0;
    return result.total - 3;
  }, [result]);

  if (!isLoading && (!result || result.total === 0)) return null;

  return (
    <HStack space="sm" alignItems="center">
      {isLoading ? (
        <HStack position="relative">
          {new Array(3).fill(0).map((_, i) => (
            <View
              key={i}
              backgroundColor="transparent"
              width={AvatarSmSize}
              height={AvatarSmSize}
              borderRadius="$full"
              marginLeft={i === 0 ? 0 : -10}>
              <Skeleton
                radius="round"
                colorMode={colorMode === 'dark' ? 'dark' : 'light'}
                height={AvatarSmSize}
                width={AvatarSmSize}
              />
            </View>
          ))}
        </HStack>
      ) : usersToDisplay.length > 0 ? (
        <AvatarGroup>
          {usersToDisplay.map((user) => (
            <Avatar key={user.id} size="sm">
              <AvatarFallbackText>{user.username || user.fullname}</AvatarFallbackText>
              {user.profilePicture && (
                <AvatarImage
                  source={{
                    uri: user.profilePicture.url,
                  }}
                />
              )}
            </Avatar>
          ))}
        </AvatarGroup>
      ) : null}

      <View backgroundColor="transparent" flex={1}>
        {isLoading ? (
          <Skeleton
            colorMode={colorMode === 'dark' ? 'dark' : 'light'}
            height={TextSmHeight}
            width={'100%'}
          />
        ) : usersToDisplay.length > 0 ? (
          <Text size="sm" fontFamily="Inter_500Medium" isTruncated>
            {translate('friendWith').toLowerCase()}{' '}
            {usersToDisplay.map((user) => user.username).join(', ')}
          </Text>
        ) : null}
      </View>
    </HStack>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
