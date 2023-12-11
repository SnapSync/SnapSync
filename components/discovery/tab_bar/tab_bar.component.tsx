import { View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TabViewProps, Route } from "react-native-tab-view";
import { Measure } from "../discovery.types";
import { TabBarItem } from "../tab_bar_item/tab_bar_item.component";
import { TabBarIndicator } from "../tab_bar_indicator/tab_bar_indicator.component";
import { SCREEN_WIDTH } from "@/utils/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorMode } from "@gluestack-style/react";
import { Layout } from "@/costants/Layout";

type Props<T extends Route> = Parameters<
  NonNullable<TabViewProps<T>["renderTabBar"]>
>[0] & {
  onIndexChange: (index: number) => void;
};

const TabBar = <T extends Route>(props: Props<T>) => {
  const containerRef = useRef<View | null>(null);
  const inputRange = props.navigationState.routes.map((_, i) => i);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const refs = useMemo(
    () =>
      [...new Array(props.navigationState.routes.length)].map(() =>
        React.createRef<View>()
      ),
    [props.navigationState.routes.length]
  );

  const tabBarWidth = useState<number>(
    SCREEN_WIDTH -
      insets.left -
      insets.right -
      Layout.ScreenPaddingHorizontal * 2 >
      250
      ? 250
      : SCREEN_WIDTH -
          insets.left -
          insets.right -
          Layout.ScreenPaddingHorizontal * 2
  )[0];
  const [tabBarHeight] = useState<number>(50);

  useEffect(() => {
    const measureValues: Measure[] = [];

    setTimeout(() => {
      refs.forEach((r) => {
        if (!r.current) {
          return;
        }

        r.current.measureLayout(
          containerRef.current as any,
          (x, y, width, height) => {
            measureValues.push({
              x,
              y,
              width,
              height,
            });
          },
          () => {}
        );
      });

      setMeasures(measureValues);
    });
  }, [refs]);

  return (
    <View
      style={{
        position: "absolute",
        zIndex: 999,
        elevation: 999,
        bottom: insets.bottom === 0 ? 20 : insets.bottom,
        flexDirection: "row",
        backgroundColor: colorMode === "dark" ? "#404040" : "#E5E5E5",
        justifyContent: "space-between",
        height: tabBarHeight,
        borderRadius: 50,
        alignSelf: "center",
        width: tabBarWidth,
      }}
      ref={containerRef}
    >
      {props.navigationState.routes.map((route, i) => {
        const opacity = props.position.interpolate({
          inputRange,
          outputRange: inputRange.map((inputRangeIndex) =>
            inputRangeIndex === i ? 1 : 0.5
          ),
        });

        return (
          <TabBarItem
            key={i}
            onPress={props.onIndexChange}
            index={i}
            opacity={opacity}
            ref={refs[i]}
          >
            {route.title}
          </TabBarItem>
        );
      })}
      {measures.length > 0 && (
        <TabBarIndicator
          measures={measures}
          width={tabBarWidth}
          height={tabBarHeight}
          position={props.position}
          navigationState={props.navigationState}
        />
      )}
    </View>
  );
};

export default TabBar;
