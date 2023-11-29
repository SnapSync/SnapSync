import React from "react";
import { ICountryList } from "@/interfaces/countries_list.interface";
import { CheckIcon, Icon, Text, View } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { Layout } from "@/costants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import countryItemStyles from "./country_item.styles";

type Props = {
  item: ICountryList;
  isSelected?: boolean;

  pl?: number;
  pr?: number;

  onPress?: (item: ICountryList) => void;

  withDarkMode?: boolean;
};

const CountryItem = ({
  item,
  isSelected = false,

  pl,
  pr,

  onPress,

  withDarkMode = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[
        countryItemStyles.container,
        {
          paddingLeft: pl ?? insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: pr ?? insets.right + Layout.DefaultMarginHorizontal,
        },
      ]}
      onPress={() => onPress?.(item)}
      disabled={isSelected}
    >
      <View style={countryItemStyles.countryInfo}>
        <Text>{item.flag}</Text>
        <Text style={countryItemStyles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={countryItemStyles.dialCode}
          color={withDarkMode ? "$textDark400" : "$textLight700"}
        >
          (+{item.dialCode})
        </Text>
      </View>

      {isSelected && (
        <View style={countryItemStyles.selected}>
          <Icon
            as={CheckIcon}
            size="sm"
            color={withDarkMode ? "$textDark0" : "$textLight950"}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CountryItem;
