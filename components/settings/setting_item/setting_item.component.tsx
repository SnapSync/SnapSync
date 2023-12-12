import {
  Icon,
  Pressable,
  Switch,
  Text,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import { ChevronRightCircle } from "lucide-react-native";
import React, { useState } from "react";

type Props = {
  label: string;
  onPress?: () => void;
  iconAs?: React.ElementType;
  variant?: "default" | "danger";
  showSwitch?: boolean;
  onToggleSwitch?: (value: boolean) => void;
  valueSwitch?: boolean;
  isDisabledSwitch?: boolean;
};

const SettingItem = ({
  label,
  onPress,
  variant = "default",
  iconAs = ChevronRightCircle,
  showSwitch = false,
  onToggleSwitch,
  valueSwitch,
  isDisabledSwitch,
}: Props) => {
  const colorMode = useColorMode();

  const [color] = useState<string>(
    colorMode === "dark"
      ? variant === "default"
        ? "$textDark0"
        : "$error700"
      : variant === "default"
      ? "$textLight950"
      : "$error400"
  );

  if (showSwitch) {
    return (
      <View
        flex={1}
        bgColor="transparent"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          color={color}
          size="sm"
          fontFamily="Inter_600SemiBold"
          isTruncated
          flexShrink={1}
        >
          {label}
        </Text>
        <Switch
          size="sm"
          onToggle={onToggleSwitch}
          value={valueSwitch}
          isDisabled={isDisabledSwitch}
        />
      </View>
    );
  }

  return (
    <Pressable
      flex={1}
      bgColor="transparent"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      onPress={onPress}
    >
      <Text
        color={color}
        size="sm"
        fontFamily="Inter_600SemiBold"
        isTruncated
        flexShrink={1}
      >
        {label}
      </Text>
      <Icon as={iconAs} size="sm" color={color} />
    </Pressable>
  );
};

export default SettingItem;
