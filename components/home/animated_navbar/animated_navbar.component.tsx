import React from "react";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Icon,
  VStack,
  View,
  useColorMode,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { Users2Icon } from "lucide-react-native";
import { Layout } from "@/costants/Layout";
import { Skeleton } from "moti/skeleton";

const AnimatedView = Animated.createAnimatedComponent(View);

export const ANIMATED_NAVBAR_HEIGHT = 56;

type Props = {
  animatedValue: SharedValue<number>;
  avatarUrl?: string;
  avatarBlurhash?: string | null;
  username?: string;
  fullname?: string;
  isLoadingMe?: boolean;

  pendingFriendRequestsCount?: number;

  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
};

const AnimatedNavbar = ({
  animatedValue,

  avatarUrl,
  avatarBlurhash,
  username,
  fullname,
  isLoadingMe = false,

  pendingFriendRequestsCount,

  onPressLeftIcon,
  onPressRightIcon,
}: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  // Quando l'utente scrolla verso il basso, l'header si nasconde, mentre quando scrolla verso l'alto, l'header si mostra
  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(animatedValue.value, {
            duration: 200,
            easing: Easing.linear,
          }),
        },
      ],
    };
  });

  const badgeStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        pendingFriendRequestsCount && pendingFriendRequestsCount > 0 ? 1 : 0,
        {
          duration: 200,
          easing: Easing.linear,
        }
      ),
    };
  });

  return (
    <AnimatedView
      height={ANIMATED_NAVBAR_HEIGHT + insets.top}
      paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
      paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
      paddingTop={insets.top}
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={3}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={[headerStyle]}
      borderBottomWidth={1}
      borderColor={colorMode === "dark" ? "$borderDark800" : "$borderLight100"}
    >
      <View
        flex={1}
        backgroundColor="transparent"
        alignItems="flex-start"
        justifyContent="center"
        height="100%"
      >
        <TouchableOpacity onPress={onPressLeftIcon}>
          <VStack>
            <AnimatedView
              position={"absolute"}
              width={6}
              height={6}
              top={6}
              right={-18}
              zIndex={1}
              elevation={1}
              style={[badgeStyle]}
              bgColor={colorMode === "dark" ? "$red700" : "$red500"}
              rounded="$full"
            />
            <Icon
              as={Users2Icon}
              size="xl"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          </VStack>
        </TouchableOpacity>
      </View>
      <View
        flex={1}
        backgroundColor="transparent"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text fontSize="$lg" lineHeight="$lg" fontWeight="$bold">
          SnapSync
        </Text>
      </View>
      <View
        flex={1}
        backgroundColor="transparent"
        alignItems="flex-end"
        justifyContent="center"
        height="100%"
      >
        <TouchableOpacity onPress={onPressRightIcon}>
          <Skeleton
            width={32}
            height={32}
            show={isLoadingMe}
            radius="round"
            colorMode={colorMode === "dark" ? "dark" : "light"}
          >
            <Avatar size="sm">
              <AvatarFallbackText>{username ?? fullname}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: avatarUrl,
                }}
              />
            </Avatar>
          </Skeleton>
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
};

export default AnimatedNavbar;
