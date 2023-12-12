import { createStyle } from "@gluestack-style/react";

export const ButtonText = createStyle({
  color: "$textLight0",
  fontFamily: "$body",
  rounded: "$lg",
  _web: {
    userSelect: "none",
  },
});
