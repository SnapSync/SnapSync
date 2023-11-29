import React from "react";
import topSectionStyles from "./top_section.styles";
import { View, Text } from "@gluestack-ui/themed";

type Props = {
  title: string;
  subtitle?: string;

  withDarkMode?: boolean;
};

const TopSection = ({ title, subtitle, withDarkMode = false }: Props) => {
  return (
    <View style={[topSectionStyles.container]}>
      <Text
        style={topSectionStyles.title}
        color={withDarkMode ? "$textDark0" : "$textLight950"}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={topSectionStyles.subTitle}
          color={withDarkMode ? "$textDark400" : "$textLight700"}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default TopSection;
