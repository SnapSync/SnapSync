import { StyleSheet } from "react-native";

const bottomSheetItemStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 24,
    gap: 16,
  },
  label: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default bottomSheetItemStyles;
