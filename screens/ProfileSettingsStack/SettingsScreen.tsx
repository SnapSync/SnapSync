import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ProfileSettingsStackScreenProps } from '@/utils/Routes';

type Props = ProfileSettingsStackScreenProps<'Settings'>;

const SettingsScreen = ({ navigation, route }: Props) => {
  return (
    <View>
      <Text>SettingsScreen</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
