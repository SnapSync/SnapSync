import React from "react";
import animatedNavbarStyles from "./animated_navbar.styles";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  VStack,
  View,
} from "@gluestack-ui/themed";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Users2Icon } from "lucide-react-native";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = {
  animatedValue: SharedValue<number>;
  avatarUrl?: string;
  username?: string;

  pendingFriendRequestsCount?: number;
  withDarkMode?: boolean;

  containerStyle?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;

  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
};

const AnimatedNavbar = ({
  animatedValue,
  containerStyle,

  avatarUrl,
  username,

  pendingFriendRequestsCount,

  withDarkMode = false,

  onPressLeftIcon,
  onPressRightIcon,
}: Props) => {
  const insets = useSafeAreaInsets();

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
      style={[
        headerStyle,
        animatedNavbarStyles.container,
        {
          height: 56 + insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingTop: insets.top,
        },
        containerStyle,
      ]}
      bgColor={withDarkMode ? "$backgroundDark950" : "$backgroundLight0"}
      borderBottomWidth={1}
      borderColor={withDarkMode ? "$borderDark800" : "$borderLight100"}
    >
      <View style={[animatedNavbarStyles.section, animatedNavbarStyles.left]}>
        <TouchableOpacity onPress={onPressLeftIcon}>
          <VStack>
            <AnimatedView
              style={[animatedNavbarStyles.badge, badgeStyle]}
              bgColor={withDarkMode ? "$red700" : "$red500"}
              rounded="$full"
            />
            <Icon
              as={Users2Icon}
              size="xl"
              color={withDarkMode ? "$textDark0" : "$textLight950"}
            />
          </VStack>
        </TouchableOpacity>
      </View>
      <View style={[animatedNavbarStyles.section]}></View>
      <View style={[animatedNavbarStyles.section, animatedNavbarStyles.right]}>
        <TouchableOpacity onPress={onPressRightIcon}>
          <Avatar borderRadius="$full" size="sm" width={30} height={30}>
            <AvatarFallbackText fontFamily="Inter-Bold">
              {username}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: avatarUrl,
              }}
            />
          </Avatar>
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
};

export default AnimatedNavbar;
