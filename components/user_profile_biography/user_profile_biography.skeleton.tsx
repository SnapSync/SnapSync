import { StyleSheet } from "react-native";
import React from "react";
import { View, useColorMode } from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";

type Props = {
  numRows?: number;
};

const UserProfileBiographySkeleton = ({ numRows = 3 }: Props) => {
  const colorMode = useColorMode();

  return (
    <View style={[styles.container]} gap="$1">
      {new Array(numRows).fill(0).map((_, i) => (
        <Skeleton
          key={i}
          colorMode={colorMode === "dark" ? "dark" : "light"}
          width="100%"
          height={22}
        />
      ))}
    </View>
  );
};

export default UserProfileBiographySkeleton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
});
