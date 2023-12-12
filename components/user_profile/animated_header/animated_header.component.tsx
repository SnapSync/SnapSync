import { View, Text } from "@gluestack-ui/themed";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Layout } from "@/costants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  scale: 1 | Animated.AnimatedInterpolation<string | number>;
  translateYUp: 0 | Animated.AnimatedInterpolation<string | number>;
  translateYDown: 0 | Animated.AnimatedInterpolation<string | number>;
  opacity: 1 | Animated.AnimatedInterpolation<string | number>;

  avatarUrl?: string | null;
  imageSize?: number;
  fullname?: string;
  username?: string;
  streak?: number | null;
};

const AnimatedHeader = ({
  scale,
  translateYUp,
  translateYDown,
  opacity,
  avatarUrl,
  imageSize = SCREEN_WIDTH,
  fullname,
  username,
  streak,
}: Props) => {
  const insets = useSafeAreaInsets();

  console.log("AnimatedHeader");

  return (
    <View
      style={[
        {
          alignItems: "center",
          overflow: "hidden",
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
            backgroundColor: "red",
          }}
        />
      )}
      <AnimatedLinearGradient
        // Background Linear Gradient
        colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.5)", "transparent"]}
        locations={[1, 0.2, 0]}
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            elevation: 1,
            flexDirection: "row",
            gap: 0,
            justifyContent: "space-between",
            paddingBottom: 10,
            paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
            paddingRight: insets.right + Layout.DefaultMarginHorizontal,
          },
          { opacity },
        ]}
      >
        <View
          flexDirection="column"
          justifyContent="center"
          backgroundColor="transparent"
          flex={3}
        >
          <Text
            numberOfLines={2}
            color={"$textDark0"}
            // fontFamily="Inter-ExtraBold"
            fontSize="$4xl"
            lineHeight="$4xl"
          >
            {fullname}
          </Text>
          <Text
            numberOfLines={1}
            flexShrink={1}
            flexWrap="wrap"
            color={"$textDark0"}
            // fontFamily="Inter-Regular"
            fontSize="$md"
            lineHeight="$md"
          >
            {username}
          </Text>
        </View>
        {streak && streak > 0 ? (
          <View
            flex={1}
            alignItems="center"
            justifyContent="flex-end"
            backgroundColor="transparent"
          >
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.35)", "rgba(255, 255, 255, 0)"]}
              locations={[0, 1]}
              // Da sinistra a destra
              start={[0, 0]}
              end={[1, 0]}
              style={{
                width: 67,
                height: 34,
                borderRadius: 31,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                color={"$textDark0"}
                fontSize="$sm"
                // fontFamily="Inter-SemiBold"
                lineHeight="$sm"
              >
                {streak} 🔥
              </Text>
            </LinearGradient>
          </View>
        ) : null}
      </AnimatedLinearGradient>
    </View>
  );
};

export default AnimatedHeader;
