import { Text } from "@gluestack-ui/themed";
import React from "react";
import biographyStyles from "./biography.styles";

type Props = {
  biography?: string | null;
  isLoading?: boolean;

  withDarkMode?: boolean;
};

const Biography = ({
  biography,
  isLoading = false,

  withDarkMode = false,
}: Props) => {
  if (biography) {
    return (
      <Text
        style={biographyStyles.text}
        color={withDarkMode ? "$textDark400" : "$textLight700"}
      >
        {biography}
      </Text>
    );
  }

  return null;
};

export default Biography;
