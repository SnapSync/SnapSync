import { View, useColorMode, Text, Icon } from "@gluestack-ui/themed";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  iconAs: any;
  sectionName: string;
};

const SettingSectionHeader = ({ iconAs, sectionName }: Props) => {
  const colorMode = useColorMode();

  return (
    <View
      width="100%"
      backgroundColor="transparent"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      gap="$2"
      marginBottom="$3"
    >
      <LinearGradient
        colors={[
          colorMode === "dark" ? "#1A91FF" : "#0077E6",
          colorMode === "dark" ? "#737373" : "#5F5F5F",
        ]}
        style={{
          width: 48,
          height: 48,
          borderRadius: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon as={iconAs} size="md" color={"$textDark0"} />
      </LinearGradient>
      <Text
        fontFamily="Inter_600SemiBold"
        size="lg"
        color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
      >
        {sectionName}
      </Text>
    </View>
  );
};

export default SettingSectionHeader;
