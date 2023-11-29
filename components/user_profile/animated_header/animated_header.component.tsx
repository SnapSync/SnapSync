import { View, Text } from "@gluestack-ui/themed";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import {
  Animated,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import animatedHeaderStyles from "./animated_header.styles";

type Props = {
  scale: 1 | Animated.AnimatedInterpolation<string | number>;
  translateYUp: 0 | Animated.AnimatedInterpolation<string | number>;
  translateYDown: 0 | Animated.AnimatedInterpolation<string | number>;

  footerContainerStyle?: StyleProp<ViewStyle>;

  avatarUrl?: string | null;
  imageSize?: number;
  fullname?: string;
  streak?: number | null;
};

const AnimatedHeader = ({
  scale,
  translateYUp,
  translateYDown,
  footerContainerStyle,
  avatarUrl,
  imageSize = SCREEN_WIDTH,
  fullname,
  streak,
}: Props) => {
  return (
    <View
      style={[
        animatedHeaderStyles.container,
        {
          marginTop: -SCREEN_WIDTH * 4,
          paddingTop: SCREEN_WIDTH * 4,
        },
      ]}
    >
      {avatarUrl ? (
        <Animated.Image
          source={{
            uri: avatarUrl,
          }}
          style={[
            { height: imageSize, width: imageSize },
            {
              transform: [
                {
                  scale,
                },
                {
                  translateY: translateYUp,
                },
                {
                  translateY: translateYDown,
                },
              ],
            },
          ]}
        />
      ) : (
        <View
          style={{
            height: imageSize,
            width: imageSize,
            backgroundColor: "transparent",
          }}
        />
      )}
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(0,0,0,1)", "transparent"]}
        locations={[0, 1]}
        // From bottom to top
        start={[0, 1]}
        end={[0, 0]}
        style={[animatedHeaderStyles.footerContainer, footerContainerStyle]}
      >
        <Text
          style={animatedHeaderStyles.fullname}
          numberOfLines={2}
          color={"$textDark0"}
        >
          {fullname}
        </Text>
        {streak && streak > 0 && (
          <View
            style={animatedHeaderStyles.streakContainer}
            bgColor={"$textDark0"}
          >
            <Text style={animatedHeaderStyles.streak} color={"$textLight950"}>
              {streak} 🔥
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default AnimatedHeader;
