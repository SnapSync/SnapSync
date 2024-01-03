import i18n from "@/lang";
import { Divider, View, Text, Pressable } from "@gluestack-ui/themed";
import React from "react";
import { StyleSheet } from "react-native";

type Props = {
  friends?: number;
  streak?: number;

  onPressFriendsCount?: () => void;
};

const UserProfileCounters = ({
  friends = 0,
  streak = 0,

  onPressFriendsCount,
}: Props) => {
  // Se sono piu di un milione di amici, mostro 1m+ e cosi via
  const renderTextFriends: string = React.useMemo(() => {
    if (friends >= 1000000) {
      return "1m+";
    } else if (friends >= 1000) {
      return friends.toString().slice(0, -3) + "k+";
    } else {
      return friends.toString();
    }
  }, [friends]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.item} onPress={onPressFriendsCount}>
          <Text fontFamily="Inter_600SemiBold" size="xl">
            {renderTextFriends}
          </Text>
          <Text fontFamily="Inter_400Regular" size="xs">
            {i18n.t("profileScreen.friendsCount", {
              count: friends,
            })}
          </Text>
        </Pressable>
        <Divider orientation="vertical" />
        <View style={styles.item}>
          <Text fontFamily="Inter_600SemiBold" size="xl">
            {streak}
          </Text>
          <Text fontFamily="Inter_400Regular" size="xs">
            {i18n.t("streak")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfileCounters;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  content: {
    width: "100%",
    maxWidth: 327,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  item: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
