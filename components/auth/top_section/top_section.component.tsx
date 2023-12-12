import React from "react";
import { View, Heading } from "@gluestack-ui/themed";

type Props = {
  title: string;
  children?: React.ReactNode;
};

const TopSection = ({ title, children }: Props) => {
  return (
    <View
      paddingTop="$16"
      backgroundColor="transparent"
      maxWidth={500}
      flex={1}
    >
      <View alignItems="center" gap={8} backgroundColor="transparent">
        <Heading size="lg">{title}</Heading>
      </View>
      {children}
    </View>
  );
};

export default TopSection;
