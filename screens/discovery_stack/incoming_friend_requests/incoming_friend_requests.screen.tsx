import { StyleSheet, Text } from "react-native";
import React from "react";
import { View } from "@gluestack-ui/themed";
import { DiscoveryStackScreenProps } from "@/types";

type Props = DiscoveryStackScreenProps<"IncomingFriendRequests">;

const IncomingFriendRequestsScreen = (props: Props) => {
  return (
    <View
      flex={1}
      backgroundColor="transparent"
      justifyContent="center"
      alignItems="center"
    >
      <Text>IncomingFriendRequestsScreen</Text>
    </View>
  );
};

export default IncomingFriendRequestsScreen;

const styles = StyleSheet.create({});
