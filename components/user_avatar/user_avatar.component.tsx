import { useColorMode } from "@gluestack-style/react";
import { View, Text } from "@gluestack-ui/themed";
import React from "react";
import { Image } from "expo-image";
import userAvatarStyles from "./user_avatar.styles";
import { Skeleton } from "moti/skeleton";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
  /**
   * Dimension of the avatar
   * @type number
   * @example
   * <UserAvatar size={30} />
   */
  size: number;

  /**
   * Url of the avatar
   * @type string
   * @optional
   * @example
   * <UserAvatar avatarUrl="https://example.com/avatar.png" />
   */
  avatarUrl?: string;

  /**
   * BlurHash of the avatar
   * @type string
   * @optional
   * @example
   * <UserAvatar avatarBlurHash="L5EC1a~q00%2_4s9%2x]00%2t7WB" />
   */
  avatarBlurHash?: string;

  /**
   * Username of the user
   * @type string
   * @optional
   * @example
   * <UserAvatar username="John Doe" />
   */
  username?: string;

  /**
   * If the avatar is loading
   * @type boolean
   * @optional
   * @example
   * <UserAvatar isLoading />
   */
  isLoading?: boolean;

  /**
   * Style of the container
   * @type StyleProp<ViewStyle>
   * @optional
   * @example
   * <UserAvatar containerStyle={{ marginBottom: 10 }} />
   */
  containerStyle?: StyleProp<ViewStyle>;
};

const UserAvatar = ({
  size,
  avatarUrl,
  avatarBlurHash,
  username,
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
          alignItems: "center",
          justifyContent: "center",
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
      ) : avatarUrl ? (
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
      ) : username ? (
        <Text
          style={userAvatarStyles.textFirstChar}
          color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
        >
          {username[0].toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
};

export default UserAvatar;
