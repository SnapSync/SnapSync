import { StyleSheet } from "react-native";

const countryItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "transparent",
  },
  name: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    lineHeight: 24,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  dialCode: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 24,
  },
  selected: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default countryItemStyles;
