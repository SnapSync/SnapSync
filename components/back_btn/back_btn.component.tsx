import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  Divider,
  Icon,
  View,
  Text,
  useColorMode,
  ChevronLeftIcon,
} from "@gluestack-ui/themed";

type Props = {
  onPress?: () => void;
};

const BackBtn = ({ onPress }: Props) => {
  const colorMode = useColorMode();

  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        as={ChevronLeftIcon}
        size="xl"
        color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
      />
    </TouchableOpacity>
  );
};

export default BackBtn;

const styles = StyleSheet.create({});
