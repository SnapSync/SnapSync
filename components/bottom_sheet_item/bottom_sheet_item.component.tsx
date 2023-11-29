import { Divider, Icon, View, Text } from "@gluestack-ui/themed";
import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import bottomSheetItemStyles from "./bottom_sheet_item.styles";

type Props = {
  variant?: "default" | "danger";

  containerStyle?: StyleProp<ViewStyle>;

  iconAs: any;
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xs";

  label?: string;

  onPress?: () => void;

  withDivider?: boolean;

  withDarkMode?: boolean;
};

const BottomSheetItem = ({
  variant = "default",
  containerStyle,

  iconAs,
  iconSize = "md",

  label,

  onPress,

  withDivider = false,

  withDarkMode = false,
}: Props) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        width: "100%",
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[bottomSheetItemStyles.container, containerStyle]}
      >
        <Icon
          as={iconAs}
          size={iconSize}
          color={
            withDarkMode
              ? variant === "default"
                ? "$textDark0"
                : "$error400"
              : variant === "default"
              ? "$textLight950"
              : "$error700"
          }
        />
        <Text
          style={[bottomSheetItemStyles.label]}
          color={
            withDarkMode
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
