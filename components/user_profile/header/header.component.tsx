import { Layout } from "@/costants/Layout";
import {
  View,
  Text,
  Avatar,
  AvatarFallbackText,
  useColorMode,
} from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  headerHeight: number;
  username?: string;
  fullname?: string;
  streak?: number | null;
  isLoading?: boolean;
};

const Header = ({
  headerHeight,
  username,
  fullname,
  streak,
  isLoading = false,
}: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  return (
    <View
      paddingTop={headerHeight + 24}
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
    >
      <View flexDirection="column" gap={12}>
        <Skeleton
          radius="round"
          width={64}
          height={64}
          show={isLoading}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Avatar borderRadius="$full" size="lg">
            <AvatarFallbackText fontFamily="Inter-Bold">
              {username ? username : fullname}
            </AvatarFallbackText>
          </Avatar>
        </Skeleton>

        <Skeleton
          show={isLoading && !fullname}
          height={16}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Text
            numberOfLines={2}
            fontFamily="Inter-ExtraBold"
            fontSize="$4xl"
            lineHeight="$4xl"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          >
            {fullname}
          </Text>
        </Skeleton>

        {streak && streak > 0 ? (
          <Text
            fontSize="$sm"
            fontFamily="Inter-SemiBold"
            lineHeight="$sm"
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
          >
            {streak} 🔥
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
