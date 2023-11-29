import { Avatar, AvatarFallbackText, Text, View } from "@gluestack-ui/themed";
import React from "react";
import headerStyles from "./header.styles";
import { StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Skeleton } from "moti/skeleton";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;

  username?: string;
  fullname?: string;
  streak?: number | null;

  isLoading?: boolean;

  withDarkMode?: boolean;
};

const Header = ({
  containerStyle,

  username,
  fullname,
  streak,

  isLoading = false,

  withDarkMode = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        headerStyles.container,
        {
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        containerStyle,
      ]}
    >
      {username || fullname ? (
        <Avatar rounded="$full" size="lg">
          <AvatarFallbackText fontFamily="Inter-Bold">
            {username ? username : fullname}
          </AvatarFallbackText>
        </Avatar>
      ) : isLoading ? (
        <Skeleton
          colorMode={withDarkMode ? "dark" : "light"}
          width={64}
          height={64}
          radius="round"
        />
      ) : (
        <Avatar rounded="$full" size="lg" />
      )}

      {fullname ? (
        <Text
          style={[headerStyles.fullname]}
          color={withDarkMode ? "$textDark0" : "$textLight950"}
        >
          {fullname}
        </Text>
      ) : isLoading ? (
        <Skeleton
          colorMode={withDarkMode ? "dark" : "light"}
          width={"100%"}
          height={16}
        />
      ) : null}

      {streak && streak > 0 ? (
        <Text
          style={[headerStyles.streak]}
          color={withDarkMode ? "$textDark400" : "$textLight700"}
        >
          {streak} 🔥
        </Text>
      ) : isLoading ? (
        <Skeleton
          colorMode={withDarkMode ? "dark" : "light"}
          width={"30%"}
          height={16}
        />
      ) : null}
    </View>
  );
};

export default Header;
