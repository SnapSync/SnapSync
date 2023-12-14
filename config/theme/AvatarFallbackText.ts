import { createStyle } from "@gluestack-style/react";

export const AvatarFallbackText = createStyle({
  color: "$textLight950",
  fontWeight: "$semibold",
  _dark: {
    color: "$textDark0",
  },
  props: {
    size: "xl",
  },
  overflow: "hidden",
  textTransform: "uppercase",
  _web: {
    cursor: "default",
  },
});
