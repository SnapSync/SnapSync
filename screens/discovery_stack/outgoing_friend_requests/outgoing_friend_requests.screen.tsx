import { StyleSheet, Text } from "react-native";
import React from "react";
import { DiscoveryStackScreenProps } from "@/types";
import { View } from "@gluestack-ui/themed";

type Props = DiscoveryStackScreenProps<"OutgoingFriendRequests">;

const OutgoingFriendRequestsScreen = (props: Props) => {
  return (
    <View
      flex={1}
      backgroundColor="transparent"
      justifyContent="center"
      alignItems="center"
    >
      <Text>OutgoingFriendRequestsSceen</Text>
    </View>
  );
};

export default OutgoingFriendRequestsScreen;

const styles = StyleSheet.create({});
