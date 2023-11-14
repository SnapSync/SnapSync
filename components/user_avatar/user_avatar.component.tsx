import { useColorMode } from "@gluestack-style/react";
import { View } from "@gluestack-ui/themed";
import React from "react";
import { Image } from "expo-image";
import userAvatarStyles from "./user_avatar.styles";
import { Skeleton } from "moti/skeleton";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
  size: number;
  avatarUrl?: string;
  avatarBlurHash?: string;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const UserAvatar = ({
  size,
  avatarUrl,
  avatarBlurHash,
  isLoading,
  containerStyle,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <View
      style={[
        colorMode === "dark"
          ? userAvatarStyles.viewDarkMode
          : userAvatarStyles.viewLightMode,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      {isLoading ? (
        <Skeleton
          colorMode={colorMode === "dark" ? "dark" : "light"}
          radius="round"
          height={size}
          width={size}
        />
      ) : (
        <Image
          source={{ uri: avatarUrl }}
          placeholder={avatarBlurHash}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          transition={1000}
          contentFit="cover"
        />
      )}
    </View>
  );
};

export default UserAvatar;
