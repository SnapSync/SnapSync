import { createStyle } from "@gluestack-style/react";

export const FormControlLabelText = createStyle({
  fontWeight: "$medium",
  fontFamily: "Inter_500Medium",
  color: "$textLight900",
  _dark: {
    color: "$textDark50",
  },
});
