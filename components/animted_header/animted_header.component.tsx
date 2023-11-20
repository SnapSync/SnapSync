import React from "react";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import animatedHeaderStyles from "./animted_header.styles";
import { View } from "@gluestack-ui/themed";

type Props = {
  /**
   * Animated value
   * @type SharedValue<number>
   * @example
   * <AnimatedHeader animatedValue={animatedValue} />
   *
   * const animatedValue = useSharedValue(0);
   * <AnimatedHeader animatedValue={animatedValue} />
   *
   * @see https://docs.swmansion.com/react-native-reanimated/docs/api/useSharedValue
   */
  animatedValue: SharedValue<number>;

  /**
   * Duration of the animation
   * @type number
   * @optional
   * @default 200
   * @example
   * <AnimatedHeader animatedValue={animatedValue} duration={100} />
   */
  duration?: number;

  /**
   * Height of the header
   * @type number
   * @optional
   * @default 56
   * @example
   * <AnimatedHeader animatedValue={animatedValue} height={100} />
   */
  height?: number;

  /**
   * If the header is in dark mode
   * @type boolean
   * @optional
   * @default false
   * @example
   * <AnimatedHeader animatedValue={animatedValue} withDarkMode />
   */
  withDarkMode?: boolean;

  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
};

const AnimatedHeader = ({
  animatedValue,
  duration,
  height,
  withDarkMode,
  leftComponent,
  rightComponent,
  centerComponent,
}: Props) => {
  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            animatedValue.value,
            {
              duration: duration ? duration : 200,
              easing: Easing.linear,
            },
            () => {}
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: height,
        },
        animatedHeaderStyles.container,
        headerStyle,
        withDarkMode ? animatedHeaderStyles.darkMode : null,
      ]}
    >
      {leftComponent ? leftComponent : null}
      {centerComponent ? centerComponent : null}
      {rightComponent ? rightComponent : null}
    </Animated.View>
  );
};

export default AnimatedHeader;
