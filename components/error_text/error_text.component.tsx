import React from "react";
import i18n from "@/lang";
import { Text, useColorMode } from "@gluestack-ui/themed";
import errorTextStyles from "./error_text.styles";

type Props = {
  message?: string;
};

const ErrorText = ({ message }: Props) => {
  const colorMode = useColorMode();

  return (
    <Text
      style={errorTextStyles.text}
      color={colorMode === "dark" ? "$textLight0" : "$textDark950"}
    >
      {message ? message : i18n.t("errors.generic")}
    </Text>
  );
};

export default ErrorText;
