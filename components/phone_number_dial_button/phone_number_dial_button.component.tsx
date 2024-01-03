import React from "react";
import * as CountyCodesList from "country-codes-list";
import { Pressable, useColorMode, Text } from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";

type Props = {
  country?: CountyCodesList.CountryData;
  onPress?: () => void;
  disabled?: boolean;
};

const PhoneNumberDialCodeButton = ({
  country,
  onPress,
  disabled = false,
}: Props) => {
  const colorMode = useColorMode();
  return (
    <Pressable
      borderRadius="$2xl"
      gap="$1"
      borderColor={colorMode === "dark" ? "$borderDark700" : "$borderLight200"}
      disabled={disabled}
      onPress={onPress}
      style={styles.container}
    >
      {country ? (
        <>
          <Text fontSize="$sm" lineHeight="$sm">
            {country.flag}
          </Text>
          <Text
            size="sm"
            fontFamily="Inter_900Black"
          >{`+${country.countryCallingCode}`}</Text>
        </>
      ) : (
        <Text size="sm" fontFamily="Inter_900Black">
          +XX
        </Text>
      )}
    </Pressable>
  );
};

export default PhoneNumberDialCodeButton;

const styles = StyleSheet.create({
  container: {
    height: 55,
    width: 75,
    backgroundColor: "transparent",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
