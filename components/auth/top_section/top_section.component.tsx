import React from "react";
import { View, Heading, Text } from "@gluestack-ui/themed";

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

const TopSection = ({ title, subtitle, children }: Props) => {
  return (
    <View
      // paddingTop="$4"
      backgroundColor="transparent"
      maxWidth={500}
      flex={1}
      width="100%"
    >
      <View alignItems="center" gap={8} backgroundColor="transparent" mb="$8">
        <Heading size="lg">{title}</Heading>
        {subtitle && (
          <Text size="md" ml="$4">
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
};

export default TopSection;
