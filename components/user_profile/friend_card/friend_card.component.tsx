import { View, useColorMode, Text } from "@gluestack-ui/themed";
import { ImageBackground } from "expo-image";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const FRIEND_CARD_WIDTH = 139;
export const FRIEND_CARD_HEIGHT = 188;
export const FRIEND_CARD_MARGIN = 10;

type Props = {
  fullname?: string;
  username?: string;
  isVerified?: boolean;
  profilePictureUrl?: string;
  profilePictureBlurHash?: string | null;
  isLoading?: boolean;
};

const FriendCard = ({
  fullname,
  username,
  isVerified = false,
  profilePictureUrl,
  profilePictureBlurHash,
  isLoading = false,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <Skeleton
      colorMode={colorMode === "dark" ? "dark" : "light"}
      show={isLoading}
      width={FRIEND_CARD_WIDTH}
      height={FRIEND_CARD_HEIGHT}
    >
      <View
        width={FRIEND_CARD_WIDTH}
        height={FRIEND_CARD_HEIGHT}
        backgroundColor="transparent"
        borderColor={
          colorMode === "dark" ? "$borderDark400" : "$borderLight700"
        }
        borderWidth={0.5}
        borderRadius="$xl"
        overflow="hidden"
        alignItems="center"
        justifyContent="flex-end"
      >
        <ImageBackground
          source={{
            uri: profilePictureUrl,
          }}
          placeholder={profilePictureBlurHash}
          blurRadius={5}
          style={{ ...StyleSheet.absoluteFillObject }}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.5)", "transparent"]}
          locations={[1, 0.2, 0]}
          style={{
            width: "100%",
            // height: 50,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <Text
            color="$textDark0"
            numberOfLines={2}
            flexShrink={1}
            flexWrap="wrap"
            fontFamily="Inter-SemiBold"
            fontSize="$lg"
            lineHeight="$lg"
          >
            {fullname}
          </Text>
          <Text
            color="$textDark0"
            numberOfLines={1}
            flexShrink={1}
            flexWrap="wrap"
            fontFamily="Inter-Regular"
            fontSize="$md"
            lineHeight="$md"
          >
            @{username}
          </Text>
        </LinearGradient>
      </View>
    </Skeleton>
  );
};

export default FriendCard;