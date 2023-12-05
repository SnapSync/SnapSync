import React from "react";
import { ICountryList } from "@/interfaces/countries_list.interface";
import {
  CheckIcon,
  Icon,
  Text,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { Layout } from "@/costants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  item: ICountryList;
  isSelected?: boolean;

  onPress?: (item: ICountryList) => void;
};

const CountryItem = ({
  item,
  isSelected = false,

  onPress,
}: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  return (
    <TouchableOpacity
      style={{
        paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
        paddingRight: insets.right + Layout.DefaultMarginHorizontal,
        flexDirection: "row",
        backgroundColor: "transparent",
        height: 50,
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => onPress?.(item)}
      disabled={isSelected}
    >
      <View
        backgroundColor="transparent"
        flexDirection="row"
        alignItems="center"
        gap={16}
      >
        <Text>{item.flag}</Text>
        <Text
          fontFamily="Inter-SemiBold"
          fontSize="$md"
          lineHeight="$md"
          flexShrink={1}
          flexWrap="wrap"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          fontFamily="Inter-Regular"
          fontSize="$sm"
          lineHeight="$sm"
          color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
        >
          (+{item.dialCode})
        </Text>
      </View>

      {isSelected && (
        <Icon
          as={CheckIcon}
          size="sm"
          // color={withDarkMode ? "$textDark0" : "$textLight950"}
        />
      )}
    </TouchableOpacity>
  );
};

export default CountryItem;
