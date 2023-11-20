import React from "react";
import i18n from "@/lang";
import { Text, useColorMode } from "@gluestack-ui/themed";
import errorTextStyles from "./error_text.styles";
import { StyleProp, TextStyle } from "react-native";

type Props = {
  /**
   * The error message to display
   */
  message?: string;
  /**
   * The style to apply to the text
   * @default {}
   * @example
   * ```
   * <ErrorText style={{ fontSize: 20 }} />
   * ```
   * @see https://reactnative.dev/docs/text#style
   *
   * */
  style?: StyleProp<TextStyle>;
};

const ErrorText = ({ message, style }: Props) => {
  const colorMode = useColorMode();

  return (
    <Text
      style={[errorTextStyles.text, style]}
      color={colorMode === "dark" ? "$textLight0" : "$textDark950"}
    >
      {message ? message : i18n.t("errors.generic")}
    </Text>
  );
};

export default ErrorText;
