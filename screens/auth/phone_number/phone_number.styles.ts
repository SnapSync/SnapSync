import { StyleSheet } from "react-native";

const phoneNumberStyles = StyleSheet.create({
  viewTextInputContainer: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  viewCountryInfo: {
    minWidth: 75,
    minHeight: 55,
    padding: 5,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    borderWidth: 1,
  },
  viewCountryInfoLight: {
    backgroundColor: "rgba(252, 252, 252, 0.60)",
    borderColor: "#F5F5F5", // BorderColorLight50
  },
  viewCountryInfoDark: {
    backgroundColor: "rgba(23, 23, 23, 0.60)",
    borderColor: "#262626", // BorderColorDark900
  },

  flagText: {
    fontSize: 14,
    fontStyle: "normal",
    lineHeight: 20,
  },
  codeText: {
    fontSize: 14,
    fontStyle: "normal",
    lineHeight: 20,
    fontFamily: "Inter-Bold",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default phoneNumberStyles;
