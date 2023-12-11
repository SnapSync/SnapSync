import {
  ChevronRightIcon,
  Icon,
  Switch,
  Text,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  showSwitch?: boolean;
  onToggle?: (value: boolean) => void;
  value?: boolean;
  isDisabled?: boolean;

  variant?: "default" | "danger";
};

const SettingItem = ({
  label,
  onPress,
  showSwitch = false,
  onToggle,
  value = false,
  isDisabled = false,
  variant = "default",
}: Props) => {
  const colorMode = useColorMode();

  if (showSwitch) {
    return (
      <View style={styles.container}>
        <Text style={styles.text} numberOfLines={1}>
          {label}
        </Text>
        <Switch
          size="sm"
          onValueChange={onToggle}
          value={value}
          isDisabled={isDisabled}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text
        style={styles.text}
        numberOfLines={1}
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
      <Icon
        as={ChevronRightIcon}
        size="md"
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
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 22,
    width: "100%",
  },
  text: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    lineHeight: 22,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});
