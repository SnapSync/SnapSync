import { Animated, StyleSheet } from "react-native";
import React from "react";
import { Divider, Text, View } from "@gluestack-ui/themed";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import { Layout } from "@/costants/Layout";

const AnimatedView = Animated.createAnimatedComponent(View);
// const AnimatedKeyboardAwareScrollView  = Animated.createAnimatedComponent(KeyboardAwareScrollView);

type Props = {
  contentOpacity: Animated.Value;
  contentTranslateY: Animated.Value;
  headerHeight: number;
};

const HomeSearchContentComponent = ({
  contentOpacity,
  contentTranslateY,
  headerHeight,
}: Props) => {
  const insets = useSafeAreaInsets();
  const bottomTabBarHeight = useBottomTabBarHeight();

  return (
    <AnimatedView
      style={[
        styles.content,
        {
          opacity: contentOpacity,
          height: SCREEN_HEIGHT - (headerHeight + insets.top),
          top: headerHeight + insets.top,
          transform: [
            {
              translateY: contentTranslateY,
            },
          ],
        },
      ]}
    >
      <View style={styles.contentSafeArea}>
        <Divider marginBottom="$2.5" />
        <FlashList
          contentContainerStyle={{
            paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
            paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
            paddingBottom: insets.bottom + bottomTabBarHeight,
          }}
          data={new Array(10).fill(0)}
          estimatedItemSize={100}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                height: 100,
                backgroundColor: "white",
                borderRadius: 10,
                marginBottom: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Item: {index}</Text>
            </View>
          )}
        />
      </View>
    </AnimatedView>
  );
};

export default HomeSearchContentComponent;

const styles = StyleSheet.create({
  content: {
    backgroundColor: "transparent",
    elevation: 999,
    zIndex: 999,
    opacity: 1,
    position: "absolute",
    width: SCREEN_WIDTH,
    left: 0,
  },
  contentSafeArea: {
    flex: 1,
  },
});
