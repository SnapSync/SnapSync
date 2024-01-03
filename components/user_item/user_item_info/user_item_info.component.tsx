import { StyleSheet } from "react-native";
import React from "react";
import { View, Text, useColorMode } from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import i18n from "@/lang";

type Props = {
  isLoading?: boolean;
  username?: string;
  fullname?: string;
  mutualFriends?: number;
};

const UserItemInfo = ({
  isLoading = false,
  username,
  fullname,
  mutualFriends,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <View style={styles.container}>
      <Skeleton
        width={"100%"}
        height={22}
        colorMode={colorMode === "dark" ? "dark" : "light"}
        show={isLoading}
      >
        <Text
          isTruncated
          flexShrink={1}
          fontFamily="Inter_600SemiBold"
          size="md"
          color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
        >
          {username}
        </Text>
      </Skeleton>
      <Skeleton
        show={isLoading}
        width={"100%"}
        height={20}
        colorMode={colorMode === "dark" ? "dark" : "light"}
      >
        <Text
          isTruncated
          flexShrink={1}
          size="sm"
          fontFamily="Inter_400Regular"
        >
          {fullname}
        </Text>
      </Skeleton>
      {mutualFriends && mutualFriends > 0 ? (
        <Text
          isTruncated
          flexShrink={1}
          size="sm"
          fontFamily="Inter_400Regular"
        >
          {mutualFriends > 20
            ? `🤝 ${i18n.t("lotOfMutualFriends")}`
            : `🤝 ${i18n.t("mutualFriends", {
                count: mutualFriends,
              })}`}
        </Text>
      ) : null}
    </View>
  );
};

export default UserItemInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8, // "$2"
    backgroundColor: "transparent",
  },
});
