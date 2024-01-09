import { StyleSheet } from 'react-native';
import React from 'react';
import { HStack, Heading, Icon, Pressable } from '@gluestack-ui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '@/assets/Layout';

type Props = {
  label: string;
  iconAs?: React.ComponentType<any>;
  onPress?: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
};

const BottomSheetItem = ({ label, iconAs, onPress, variant = 'default', disabled }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Pressable onPress={onPress} backgroundColor="transparent" disabled={disabled}>
      <HStack
        space="md"
        alignItems="center"
        paddingVertical="$4"
        style={{
          paddingLeft: insets.left + Layout.ScreenSpacingLeft,
          paddingRight: insets.right + Layout.ScreenSpacingRight,
        }}>
        <Icon as={iconAs} size="md" />
        <Heading size="md" fontFamily="Inter_600SemiBold">
          {label}
        </Heading>
      </HStack>
    </Pressable>
  );
};

export default BottomSheetItem;

const styles = StyleSheet.create({});
