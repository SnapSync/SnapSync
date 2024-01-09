import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootStackScreenProps } from '@/utils/Routes';

type Props = RootStackScreenProps<'ReportUser'>;

const ReportUserScreen = ({ navigation, route }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>{route.params?.id}</Text>
      <Text>{route.params?.username}</Text>
    </View>
  );
};

export default ReportUserScreen;

const styles = StyleSheet.create({});
