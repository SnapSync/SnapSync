import React, { useEffect } from "react";
import { Animated, StyleSheet } from "react-native";
import ReAnimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { NavigationState, Route } from "react-native-tab-view";
import { Measure } from "../discovery.types";
import { useColorMode } from "@gluestack-style/react";

type Props<T extends Route> = {
  measures: Measure[];
  width: number;
  height: number;
  position: Animated.AnimatedInterpolation<1>;
  navigationState: NavigationState<T>;
};

export const TabBarIndicator = <T extends Route>(props: Props<T>) => {
  const inputRange = props.navigationState.routes.map((_, i) => i);
  const animation = useSharedValue(0);
  const colorMode = useColorMode();

  useEffect(() => {
    // Assign the position value to the shared value.
    const id = props.position.addListener((value: { value: number }) => {
      animation.value = value.value;
    });

    return () => props.position.removeListener(id);
  }, [animation, props.position]);

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animation.value,
      inputRange,
      props.measures.map((m) => m.width)
    );
    const translateX = interpolate(
      animation.value,
      inputRange,
      props.measures.map((m) => m.x)
    );

    return {
      width: width + 40,
      transform: [{ translateX }],
    };
  }, []);

  return (
    <ReAnimated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: colorMode === "dark" ? "#171717" : "#FCFCFC",
          height: props.height - 10,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 5,
    left: -20,
    zIndex: -1,
    elevation: -1,
    borderRadius: 24,
  },
});

TabBarIndicator.displayName = "TabBarIndicator";
