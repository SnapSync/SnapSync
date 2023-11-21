import { StyleSheet } from "react-native";

const otpStyles = StyleSheet.create({
  viewOptInputContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    alignSelf: "stretch",
    width: "100%",
    height: 36,
    backgroundColor: "transparent",
  },
  codeInputHighlightStyle: {
    borderBottomWidth: 2,
  },
  codeInputFieldStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 1,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
});

export default otpStyles;
