import { StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { MainStackScreenProps } from "@/types";
import { View, useColorMode } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import DATA from "./home.data";
import { SCREEN_WIDTH } from "@/utils/helper";
import HomeSearch from "@/components/home_search/home_search.component";

type Props = MainStackScreenProps<"Home">;

const HomeScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const _keyExtractor = (item: { id: number; title: string }) =>
    item.id.toString();

  const _renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: {
        id: number;
        title: string;
      };
      index: number;
    }) => {
      return (
        <View style={[styles.item]}>
          <View style={[styles.itemLeft]}></View>
          <View style={[styles.itemRight]}></View>
        </View>
      );
    },
    []
  );

  return (
    <View style={[styles.container]}>
      <HomeSearch />
      <FlashList
        contentContainerStyle={{
          // paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}
        data={DATA}
        estimatedItemSize={SCREEN_WIDTH}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        // scrollEventThrottle={16}
        // onScroll={_onScroll}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    // justifyContent: "center",
    // alignItems: "center",
  },
  item: {
    height: SCREEN_WIDTH,
    marginVertical: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 10,
  },
  itemLeft: {
    flex: 1,
    height: "100%",
    backgroundColor: "red",
  },
  itemRight: {
    flex: 1,
    height: "100%",
    backgroundColor: "blue",
  },
});
