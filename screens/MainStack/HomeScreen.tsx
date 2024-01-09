import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Divider, Pressable, Text } from '@gluestack-ui/themed';
import { useMe } from '@/modules/app/api/queries/useMe';
import { MainStackScreenProps } from '@/utils/Routes';
import { FlashList } from '@shopify/flash-list';

type Props = MainStackScreenProps<'Home'>;

const usersArray = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 180];

const HomeScreen = ({ navigation }: Props) => {
  // const { data } = useMe();

  const goToUserProfile = (id: number) => {
    navigation.navigate('UserProfileStack', {
      screen: 'UserProfile',
      params: { id: id, fsLoader: 'add' },
    });
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={usersArray}
        renderItem={({ item }) => (
          <Pressable
            style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => goToUserProfile(item)}>
            <Text size="lg" fontFamily="Inter_600SemiBold">
              {item}
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.toString()}
        estimatedItemSize={50}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider my={2} />}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
