import { StyleSheet, View } from 'react-native';
import React from 'react';
import translate from '@/helpers/localization';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '@/assets/Layout';
import { Spinner, Text } from '@gluestack-ui/themed';

type Props = {
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
};

const ListEmptyComponent = ({
  isLoading = false,
  isError = false,
  errorText = translate('generalErrorText'),
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingLeft: insets.left + Layout.ScreenSpacingLeft,
          paddingRight: insets.right + Layout.ScreenSpacingRight,
        },
      ]}>
      {isLoading ? (
        <Spinner size="small" />
      ) : isError ? (
        <Text fontFamily="Inter_400Regular" size="sm">
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
