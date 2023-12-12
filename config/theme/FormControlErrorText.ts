import { createStyle } from "@gluestack-style/react";

export const FormControlErrorText = createStyle({
  fontFamily: "$body",
  color: "$error700",
  _dark: {
    color: "$error400",
  },
});
