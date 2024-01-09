import { RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import { UserProfileStackScreenProps } from '@/utils/Routes';
import { useInfiniteMutualFriendsList } from '@/modules/app/api/queries/useInfiniteMutualFriendsList';
import { useRefreshOnFocus, useTheme } from '@/hooks';
import { FlashList } from '@shopify/flash-list';
import Layout from '@/assets/Layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListFooterComponent from '@/modules/app/components/ListFooterComponent';
import translate from '@/helpers/localization';
import UserResultItem from '@/modules/app/components/UserResultItem';
import { Text } from '@gluestack-ui/themed';
import ListEmptyComponent from '@/modules/app/components/ListEmptyComponent';
import { IUserDTO } from '@/modules/app/types/IUserDTO';
import { isIError } from '@/utils/network/Abstract';

type Props = UserProfileStackScreenProps<'MutualFriendsList'>;

const MutualFriendsListScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const id = route.params?.id;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
  } = useInfiniteMutualFriendsList(id);
  // useRefreshOnFocus(refetch);

  React.useEffect(() => {
    if (data?.pages?.[0]?.result?.total) {
      navigation.setParams({
        total: data?.pages?.[0]?.result?.total,
      });
    }
  }, [data, navigation]);

  const renderListFooterComponent = React.useCallback(() => {
    return <ListFooterComponent isFetchingNextPage={isFetchingNextPage} />;
  }, [isFetchingNextPage]);

  const renderListEmptyComponent = React.useCallback(() => {
    return (
      <ListEmptyComponent
        isLoading={isLoading}
        isError={isError}
        errorText={
          error && isIError(error) && error.status === 404
            ? translate('errors.userNotFound')
            : undefined
        }
      />
    );
  }, [isLoading, isError, error]);

  const _onEndReached = () => hasNextPage && fetchNextPage();

  const _onRefresh = () => refetch();

  const _keyExtractor = (item: IUserDTO, index: number) => item.id.toString();

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text size="sm" fontFamily="Inter_400Regular">
          {translate('generalErrorText')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={data?.pages.map((page) => page.result?.data || []).flat() || []}
        contentContainerStyle={{
          paddingLeft: insets.left + Layout.ScreenSpacingLeft,
          paddingRight: insets.right + Layout.ScreenSpacingRight,
          paddingTop: Layout.ScreenSpacingTop,
        }}
        estimatedItemSize={50}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserResultItem item={item} />}
        ListFooterComponent={renderListFooterComponent}
        ListEmptyComponent={renderListEmptyComponent}
        onEndReachedThreshold={0.5}
        onEndReached={_onEndReached}
        keyExtractor={_keyExtractor}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={_onRefresh} tintColor={theme.text} />
        }
      />
    </View>
  );
};

export default MutualFriendsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
