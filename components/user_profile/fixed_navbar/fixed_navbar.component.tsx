import {
  ChevronLeftIcon,
  Icon,
  ThreeDotsIcon,
  View,
  Text,
} from "@gluestack-ui/themed";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import fixedNavbarStyles from "./fixed_navbar.styles";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Verified } from "lucide-react-native";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;

  username?: string;
  isVerified?: boolean;

  userHasImage?: boolean;

  withDarkMode?: boolean;

  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
};

const FixedNavBar = ({
  containerStyle,
  username,
  isVerified = false,

  userHasImage = false,

  withDarkMode = false,

  onPressLeftIcon,
  onPressRightIcon,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[userHasImage ? "rgba(0,0,0,1)" : "transparent", "transparent"]}
      locations={[0, 1]}
      start={[0, 0]}
      end={[0, 1]}
      style={[
        {
          height: 56 + insets.top,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        fixedNavbarStyles.container,
        containerStyle,
      ]}
    >
      <View style={[fixedNavbarStyles.section, fixedNavbarStyles.left]}>
        <TouchableOpacity onPress={onPressLeftIcon}>
          <Icon
            as={ChevronLeftIcon}
            size="xl"
            color={
              withDarkMode || userHasImage ? "$textDark0" : "$textLight950"
            }
          />
        </TouchableOpacity>
      </View>
      <View style={[fixedNavbarStyles.section, fixedNavbarStyles.center]}>
        <Text
          color={withDarkMode || userHasImage ? "$textDark0" : "$textLight950"}
          style={fixedNavbarStyles.username}
          numberOfLines={1}
        >
          {username}
        </Text>
        {isVerified && (
          <Icon
            as={Verified}
            size="2xs"
            color={
              withDarkMode || userHasImage ? "$textDark0" : "$textLight950"
            }
          />
        )}
      </View>
      <View style={[fixedNavbarStyles.section, fixedNavbarStyles.right]}>
        <TouchableOpacity onPress={onPressRightIcon}>
          <Icon
            as={ThreeDotsIcon}
            size="xl"
            color={
              withDarkMode || userHasImage ? "$textDark0" : "$textLight950"
            }
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default FixedNavBar;
