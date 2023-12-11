import { useColorMode } from "@gluestack-style/react";
import React, { forwardRef, useCallback } from "react";
import { TouchableOpacity, Animated, View } from "react-native";

type Props = {
  onPress: (index: number) => void;
  index: number;
  opacity: Animated.AnimatedInterpolation<1>;
  ref: React.RefObject<any>;
  children: React.ReactNode;
};

export const TabBarItem = forwardRef<any, Props>((props, ref) => {
  const colorMode = useColorMode();

  const handlePress = useCallback(() => {
    props.onPress(props.index);
  }, [props]);

  return (
    <TouchableOpacity
      // style={{ paddingHorizontal: 16, paddingTop: 16, alignItems: "center" }}
      style={{
        // backgroundColor: props.index % 2 === 0 ? "red" : "blue",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={handlePress}
    >
      <View ref={ref}>
        <Animated.Text
          style={{
            color: colorMode === "dark" ? "#FCFCFC" : "#171717",
            fontSize: 12,
            opacity: props.opacity,
            fontFamily: "Inter-Bold",
          }}
        >
          {props.children}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
});
TabBarItem.displayName = "TabBarItem";
