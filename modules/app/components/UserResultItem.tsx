import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { IUserDTO } from '../types/IUserDTO';
import {
  View,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
  Icon,
  Divider,
  HStack,
  VStack,
  Heading,
} from '@gluestack-ui/themed';
import { useAppSelector } from '@/utils/redux/store';
import { Skeleton } from 'moti/skeleton';
import { Verified } from 'lucide-react-native';
import { useThemedStyles } from '@/hooks';
import { ITheme } from '@/assets/Color/LightTheme';

const AVATARSIZE = 48;

type Props = {
  item?: IUserDTO;
  isLoading?: boolean;

  onPress?: (item: IUserDTO) => void;
  disabled?: boolean;
};

const UserResultItem = ({
  item,
  isLoading,

  onPress,
  disabled,
}: Props) => {
  const ucm = useAppSelector((state) => state.AppReducer.userColorScheme);

  const themedStyles = useThemedStyles<typeof styles>(styles);

  const _onPress = () => {
    if (!item || !onPress) return;
    onPress(item);
  };

  return (
    <TouchableOpacity
      onPress={_onPress}
      disabled={disabled}
      style={{
        paddingVertical: 5,
      }}>
      <HStack space="md">
        {isLoading ? (
          <Skeleton
            width={AVATARSIZE}
            height={AVATARSIZE}
            radius="round"
            colorMode={ucm === 'dark' ? 'dark' : 'light'}
          />
        ) : (
          <Avatar>
            <AvatarFallbackText>{item?.username || item?.fullname}</AvatarFallbackText>

            {item?.profilePicture?.url && <AvatarImage source={{ uri: item.profilePicture.url }} />}

            {item?.isVerified && (
              <AvatarBadge style={themedStyles.avatarBadge}>
                <Icon as={Verified} size="xs" />
              </AvatarBadge>
            )}
          </Avatar>
        )}
        <Divider orientation="vertical" />
        <VStack flex={1} space="xs">
          {isLoading ? (
            <Skeleton width="100%" height={25} colorMode={ucm === 'dark' ? 'dark' : 'light'} />
          ) : (
            <Heading size="sm" fontFamily="Inter_600SemiBold">
              {item?.username}
            </Heading>
          )}
          {isLoading ? (
            <Skeleton width="100%" height={20} colorMode={ucm === 'dark' ? 'dark' : 'light'} />
          ) : (
            <Text size="sm" fontFamily="Inter_400Regular">
              {item?.fullname}
            </Text>
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default React.memo(UserResultItem);

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // paddingHorizontal: 15,
      marginVertical: 5,
      backgroundColor: 'transparent',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      gap: 10,
    },
    infoContainer: {
      // marginLeft: 10,
      backgroundColor: 'transparent',
      flex: 1,
      gap: 3,
    },
    avatarBadge: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
  });
