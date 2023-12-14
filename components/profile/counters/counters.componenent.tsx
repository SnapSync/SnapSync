import i18n from "@/lang";
import {
  Divider,
  View,
  Text,
  useColorMode,
  Pressable,
} from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import React from "react";

type Props = {
  isLoadingFriendsCount?: boolean;
  friendsCount?: number;

  isLoadingSnapsCount?: boolean;
  snapsCount?: number;

  onPressFriendsCount?: () => void;
};

const Counters = ({
  isLoadingFriendsCount,
  friendsCount = 0,
  isLoadingSnapsCount,
  snapsCount = 0,

  onPressFriendsCount,
}: Props) => {
  const colorMode = useColorMode();

  // Se sono piu di 1000 amici, mostro 1k+ e cosi via
  const renderTextFriends: string = React.useMemo(() => {
    if (friendsCount >= 1000) {
      return "1k+";
    } else {
      return friendsCount.toString();
    }
  }, [friendsCount]);

  // Se sono piu di 1000 snaps, mostro 1k+ e cosi via
  const renderTextSnaps: string = React.useMemo(() => {
    if (snapsCount >= 1000) {
      return "1k+";
    } else {
      return snapsCount.toString();
    }
  }, [snapsCount]);

  return (
    <View
      width="100%"
      height={72}
      maxWidth={327}
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor="transparent"
      borderRadius="$2xl"
    >
      <Pressable
        flex={1}
        backgroundColor="transparent"
        height="$full"
        borderTopLeftRadius="$2xl"
        borderBottomLeftRadius="$2xl"
        alignItems="center"
        justifyContent="center"
        gap="$1"
        onPress={onPressFriendsCount}
      >
        {isLoadingFriendsCount ? (
          <Skeleton
            colorMode={colorMode === "dark" ? "dark" : "light"}
            width={"30%"}
            height={30}
          />
        ) : (
          <Text fontFamily="Inter_600SemiBold" size="xl">
            {renderTextFriends}
          </Text>
        )}
        <Text fontFamily="Inter_400Regular" size="xs">
          {i18n.t("profileScreen.friendsCount", {
            count: friendsCount,
          })}
        </Text>
      </Pressable>
      <Divider orientation="vertical" />
      <View
        flex={1}
        backgroundColor="transparent"
        height="$full"
        borderTopLeftRadius="$2xl"
        borderBottomLeftRadius="$2xl"
        alignItems="center"
        justifyContent="center"
        gap="$1"
      >
        {isLoadingSnapsCount ? (
          <Skeleton
            colorMode={colorMode === "dark" ? "dark" : "light"}
            width={"30%"}
            height={30}
          />
        ) : (
          <Text fontFamily="Inter_600SemiBold" size="xl">
            {renderTextSnaps}
          </Text>
        )}
        <Text fontFamily="Inter_400Regular" size="xs">
          {i18n.t("profileScreen.snapsCount", {
            count: snapsCount,
          })}
        </Text>
      </View>
    </View>
  );
};

export default Counters;
