import { createStyle } from "@gluestack-style/react";

export const ToastDescription = createStyle({
  color: "$textLight700",
  fontFamily: "$body",
  _dark: {
    color: "$textDark200",
  },
  props: {
    size: "sm",
  },
});
