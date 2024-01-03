import { StyleSheet } from "react-native";
import React from "react";
import { View, Text } from "@gluestack-ui/themed";
import UserProfileBiographySkeleton from "./user_profile_biography.skeleton";

type Props = {
  biography?: string | null;
  isLoading?: boolean;
};

const UserProfileBiography = ({ biography, isLoading }: Props) => {
  if (isLoading) return <UserProfileBiographySkeleton />;

  if (biography && biography.length > 0) {
    return (
      <View style={[styles.container]}>
        <Text size="md" fontFamily="Inter_400Regular" textAlign="center">
          {biography}
        </Text>
      </View>
    );
  }

  return null;
};

export default UserProfileBiography;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
});
