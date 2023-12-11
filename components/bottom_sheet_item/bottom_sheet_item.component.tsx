import { Divider, Icon, View, Text, useColorMode } from "@gluestack-ui/themed";
import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  variant?: "default" | "danger";

  containerStyle?: StyleProp<ViewStyle>;

  iconAs: any;
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xs";

  label?: string;

  onPress?: () => void;
  disabled?: boolean;

  withDivider?: boolean;
};

const BottomSheetItem = ({
  variant = "default",
  containerStyle,

  iconAs,
  iconSize = "md",

  label,

  onPress,
  disabled = false,

  withDivider = false,
}: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  return (
    <View backgroundColor="transparent" width="100%">
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingVertical: 24,
            gap: 16,
            // paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
            // paddingRight: insets.right + Layout.DefaultMarginHorizontal,
          },
          containerStyle,
        ]}
        disabled={disabled}
      >
        <Icon
          as={iconAs}
          size={iconSize}
          color={
            colorMode === "dark"
              ? variant === "default"
                ? "$textDark0"
                : "$error400"
              : variant === "default"
              ? "$textLight950"
              : "$error700"
          }
        />
        <Text
          fontFamily="Inter-SemiBold"
          fontSize="$md"
          lineHeight="$md"
          color={
            colorMode === "dark"
              ? variant === "default"
                ? "$textDark0"
                : "$error400"
              : variant === "default"
              ? "$textLight950"
              : "$error700"
          }
        >
          {label}
        </Text>
      </TouchableOpacity>

      {withDivider && <Divider orientation="horizontal" />}
    </View>
  );
};

export default BottomSheetItem;
