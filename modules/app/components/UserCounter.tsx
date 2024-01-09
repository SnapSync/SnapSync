import { StyleSheet } from 'react-native';
import React from 'react';
import { Divider, Pressable, Text, View } from '@gluestack-ui/themed';
import translate from '@/helpers/localization';

type Props = {
  friendsCount?: number;
  snapsCount?: number;
  streak?: number;

  isMyProfile?: boolean;

  onPressFriendsCount?: () => void;
};

const UserCounter = ({
  friendsCount,
  snapsCount,
  streak,
  isMyProfile = false,
  onPressFriendsCount,
}: Props) => {
  const textFriendsCount = React.useMemo(() => {
    if (friendsCount === undefined) return undefined;

    // Se è minore di 1000 ritorna il numero,
    // se a compreso tra 1000 e 999999 ritorna il numero con la K,
    // se è maggiore di 1000000 ritorna il numero con la M
    if (friendsCount < 1000) return friendsCount.toString();
    if (friendsCount >= 1000 && friendsCount <= 999999)
      return `${(friendsCount / 1000).toFixed(1)}K`;
    if (friendsCount > 1000000) return `${(friendsCount / 1000000).toFixed(1)}M`;
  }, [friendsCount]);

  const textSnapsCount = React.useMemo(() => {
    if (snapsCount === undefined) return undefined;

    // Se è minore di 1000 ritorna il numero,
    // se a compreso tra 1000 e 999999 ritorna il numero con la K,
    // se è maggiore di 1000000 ritorna il numero con la M
    if (snapsCount < 1000) return snapsCount.toString();
    if (snapsCount >= 1000 && snapsCount <= 999999) return `${(snapsCount / 1000).toFixed(1)}K`;
    if (snapsCount > 1000000) return `${(snapsCount / 1000000).toFixed(1)}M`;
  }, [snapsCount]);

  const textStreak = React.useMemo(() => {
    if (streak === undefined) return undefined;

    // Se è minore di 1000 ritorna il numero,
    // se a compreso tra 1000 e 999999 ritorna il numero con la K,
    // se è maggiore di 1000000 ritorna il numero con la M
    if (streak < 1000) return streak.toString();
    if (streak >= 1000 && streak <= 999999) return `${(streak / 1000).toFixed(1)}K`;
    if (streak > 1000000) return `${(streak / 1000000).toFixed(1)}M`;
  }, [streak]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.section} onPress={onPressFriendsCount}>
        <Text size="md" fontFamily="Inter_600SemiBold">
          {textFriendsCount}
        </Text>
        <Text size="sm" fontFamily="Inter_400Regular" isTruncated>
          {translate(isMyProfile ? 'friends' : 'mutualFriends')}
        </Text>
      </Pressable>
      <Divider orientation="vertical" />
      <View style={styles.section}>
        <Text size="md" fontFamily="Inter_600SemiBold">
          {textSnapsCount}
        </Text>
        <Text size="sm" fontFamily="Inter_400Regular" isTruncated>
          {translate('snaps')}
        </Text>
      </View>
      <Divider orientation="vertical" />
      <View style={styles.section}>
        <Text size="md" fontFamily="Inter_600SemiBold">
          {textStreak}
        </Text>
        <Text size="sm" fontFamily="Inter_400Regular" isTruncated>
          {translate('streak')}
        </Text>
      </View>
    </View>
  );
};

export default UserCounter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    maxWidth: 327,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
  },
});
