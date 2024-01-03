import { StyleSheet } from "react-native";
import React from "react";
import {
  Pressable,
  View,
  Text,
  useColorMode,
  Icon,
  CheckIcon,
} from "@gluestack-ui/themed";
import { ICountryList } from "@/interfaces/countries_list.interface";

type Props = {
  item: ICountryList;
  isSelected?: boolean;

  onPress?: (item: ICountryList) => void;
};

const CountryListItem = ({
  item,
  isSelected = false,

  onPress,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      disabled={isSelected}
      style={styles.container}
    >
      <View style={styles.infoContent} gap="$3">
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
        <View style={styles.iconBox}>
          <Icon
            as={CheckIcon}
            size="sm"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          />
        </View>
      ) : null}
    </Pressable>
  );
};

export default CountryListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  infoContent: {
    backgroundColor: "transparent",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iconBox: {
    backgroundColor: "transparent",
    height: "100%", // '$full',
    width: 50,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
