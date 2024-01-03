import { StyleSheet, Text } from "react-native";
import React from "react";
import { DiscoveryStackScreenProps } from "@/types";
import { View } from "@gluestack-ui/themed";

type Props = DiscoveryStackScreenProps<"ForYou">;

const ForYouScreen = (props: Props) => {
  return (
    <View
      flex={1}
      backgroundColor="transparent"
      justifyContent="center"
      alignItems="center"
    >
      <Text>ForYou</Text>
    </View>
  );
};

export default ForYouScreen;

const styles = StyleSheet.create({});
