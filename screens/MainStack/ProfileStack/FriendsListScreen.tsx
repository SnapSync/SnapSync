import { RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import { ProfileStackScreenProps } from '@/utils/Routes';
import { useMyInfiniteFriendsList } from '@/modules/app/api/queries/useMyInfiniteFriendsList';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '@/assets/Layout';
import ListFooterComponent from '@/modules/app/components/ListFooterComponent';
import { useAppSelector } from '@/utils/redux/store';
import LightTheme from '@/assets/Color/LightTheme';
import DarkTheme from '@/assets/Color/DarkTheme';
import { Spinner } from '@gluestack-ui/themed';
import translate from '@/helpers/localization';
import UserResultItem from '@/modules/app/components/UserResultItem';
import { IUserDTO } from '@/modules/app/types/IUserDTO';
import { Text } from '@gluestack-ui/themed';
import ListEmptyComponent from '@/modules/app/components/ListEmptyComponent';

type Props = ProfileStackScreenProps<'FriendsList'>;

const FriendsListScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const ucs = useAppSelector((state) => state.AppReducer.userColorScheme);

  const {
    data,
    refetch,
    isLoading,
    isError,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMyInfiniteFriendsList();

  React.useEffect(() => {
    if (data?.pages?.[0]?.result?.total) {
      navigation.setParams({ total: data.pages[0].result.total });
    }
  }, [data, navigation]);

  const renderListFooterComponent = React.useCallback(() => {
    return <ListFooterComponent isFetchingNextPage={isFetchingNextPage} />;
  }, [isFetchingNextPage]);

  const renderListEmptyComponent = React.useCallback(() => {
    return <ListEmptyComponent isLoading={isLoading} isError={isError} />;
  }, [isLoading, isError]);

  const _onEndReached = () => hasNextPage && fetchNextPage();

  const _onPress = React.useCallback(
    (item: IUserDTO) => {
      navigation.navigate('UserProfileStack', {
        screen: 'UserProfile',
        params: {
          id: item.id,
          // ...item,
        },
      });
    },
    [navigation],
  );

  const isDark = ucs === 'dark';

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
        renderItem={({ item }) => <UserResultItem item={item} onPress={_onPress} />}
        ListFooterComponent={renderListFooterComponent}
        onEndReachedThreshold={0.5}
        onEndReached={_onEndReached}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={isDark ? LightTheme.background : DarkTheme.background}
          />
        }
        ListEmptyComponent={renderListEmptyComponent}
      />
    </View>
  );
};

export default FriendsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
