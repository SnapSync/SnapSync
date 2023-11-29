import { StyleSheet } from "react-native";

const headerStyles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 170,
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "transparent",
  },
  fullname: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 36,
    lineHeight: 48,
    fontWeight: "800",
  },
  streak: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});

export default headerStyles;
