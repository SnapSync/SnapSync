import React from "react";
import { ICountryList } from "@/interfaces/countries_list.interface";
import {
  CheckIcon,
  Icon,
  Pressable,
  Text,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
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
    <Pressable
      paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
      paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
      flexDirection="row"
      backgroundColor="transparent"
      justifyContent="space-between"
      alignContent="center"
      height={50}
      onPress={() => onPress?.(item)}
      disabled={isSelected}
      flex={1}
    >
      <View
        backgroundColor="transparent"
        flexDirection="row"
        alignItems="center"
        gap="$3"
        flex={1}
      >
        <Text>{item.flag}</Text>
        <Text isTruncated flexShrink={1} size="md" fontFamily="Inter_700Bold">
          {item.name}
        </Text>
        <Text
          size="sm"
          color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
        >
          (+{item.dialCode})
        </Text>
      </View>
      {isSelected ? (
        <View
          backgroundColor="transparent"
          height="$full"
          width={50}
          alignItems="flex-end"
          justifyContent="center"
        >
          <Icon as={CheckIcon} size="sm" />
        </View>
      ) : null}
    </Pressable>
  );
};

export default CountryItem;
