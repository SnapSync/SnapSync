import { View } from "@gluestack-ui/themed";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import { Animated, ImageSourcePropType } from "react-native";
import userProfileAnimatedHeader from "./user_profile_animated_header.styles";

type Props = {
  /**
   * ScrollY of the scrollview
   * @type Animated.Value
   * @example
   * const scrollY = React.useRef(new Animated.Value(0)).current;
   * <UserProfileAnimatedHeader scrollY={scrollY} />
   * @default new Animated.Value(0)
   * @see https://reactnative.dev/docs/animatedvaluexy#docsNav
   */
  scrollY: Animated.Value;

  /**
   * Source of the image
   * @type ImageSourcePropType
   *    @optional
   * @example
   * <UserProfileAnimatedHeader source={require("path/to/image")} />
   */
  source?: ImageSourcePropType;

  /**
   * Height of the image
   * @type number
   * @optional
   * @example
   * <UserProfileAnimatedHeader imageHeight={100} />
   * @default SCREEN_WIDTH
   */
  imageHeight?: number;
};

const UserProfileAnimatedHeader = ({
  source,
  scrollY,
  imageHeight = SCREEN_WIDTH,
}: Props) => {
  return (
    <View
      style={[
        userProfileAnimatedHeader.imgContainer,
        {
          marginTop: -SCREEN_WIDTH * 4,
          paddingTop: SCREEN_WIDTH * 4,
        },
      ]}
    >
      {source ? (
        <Animated.Image
          source={source}
          style={[
            { height: imageHeight, width: SCREEN_WIDTH * 1.2 },
            {
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [2.5, 1, 0.85],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [SCREEN_WIDTH * 0.3, 0, 0],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                    outputRange: [-SCREEN_WIDTH * 0.6, 0, SCREEN_WIDTH * 0.5],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        />
      ) : (
        <Animated.View
          style={[
            { height: imageHeight, width: SCREEN_WIDTH * 1.2 },
            {
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [2.5, 1, 0.85],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [SCREEN_WIDTH * 0.3, 0, 0],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                    outputRange: [-SCREEN_WIDTH * 0.6, 0, SCREEN_WIDTH * 0.5],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

export default UserProfileAnimatedHeader;
