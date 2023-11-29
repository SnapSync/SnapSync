import { Animated as RNAnimated, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import animatedTabBarStyles from "./animated_tabbar.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "@gluestack-ui/themed";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";

type Props = {
  width: number;
  index: number;
  onChangeTab?: (index: number) => void;

  withDarkMode?: boolean;
};

const SLIDER_MARGIN = 5;
const TAB_HEIGHT = 50;

const AnimatedTabBar = ({
  width,
  index,
  onChangeTab,
  withDarkMode = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  const [translateX] = useState(new RNAnimated.Value(0));

  React.useEffect(() => {
    translateTab(index);
  }, [index]);

  const translateTab = (index: number) => {
    RNAnimated.spring(translateX, {
      toValue: index * (width / 3) + SLIDER_MARGIN,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[
        animatedTabBarStyles.container,
        {
          width: width,
          height: TAB_HEIGHT,
          bottom: insets.bottom + 10,
        },
      ]}
      bgColor={withDarkMode ? "$backgroundDark800" : "$backgroundLight100"}
    >
      <RNAnimated.View
        // bgColor={withDarkMode ? "$primary400" : "$primary700"}
        style={[
          animatedTabBarStyles.slider,
          {
            width: width / 3 - SLIDER_MARGIN * 2,
            height: TAB_HEIGHT - SLIDER_MARGIN * 2,
            marginTop: SLIDER_MARGIN,
            backgroundColor: withDarkMode ? Layout.LightBgc : Layout.DarkBgc,
          },
          {
            transform: [
              {
                translateX,
              },
            ],
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => onChangeTab?.(0)}
        style={animatedTabBarStyles.tab}
      >
        <Text
          style={animatedTabBarStyles.text}
          color={
            index === 0
              ? withDarkMode
                ? "$textLight950"
                : "$textDark0"
              : withDarkMode
              ? "$textDark300"
              : "$textLight700"
          }
        >
          {i18n.t("friends")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChangeTab?.(1)}
        style={animatedTabBarStyles.tab}
      >
        <Text
          style={animatedTabBarStyles.text}
          color={
            index === 1
              ? withDarkMode
                ? "$textLight950"
                : "$textDark0"
              : withDarkMode
              ? "$textDark300"
              : "$textLight700"
          }
        >
          {i18n.t("requests")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChangeTab?.(2)}
        style={animatedTabBarStyles.tab}
      >
        <Text
          style={animatedTabBarStyles.text}
          color={
            index === 2
              ? withDarkMode
                ? "$textLight950"
                : "$textDark0"
              : withDarkMode
              ? "$textDark300"
              : "$textLight700"
          }
        >
          {i18n.t("suggestions")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnimatedTabBar;
