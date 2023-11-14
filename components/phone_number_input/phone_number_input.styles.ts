import { Layout } from "@/costants/Layout";
import { SCREEN_WIDTH } from "@/utils/helper";
import { StyleSheet } from "react-native";

const phoneNumberInputStyles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - Layout.DefaultMarginHorizontal * 2,
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 16,
  },
  flagButtonView: {
    // width: 78,
    height: "100%",
    // minWidth: 32,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  codeText: {
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 20,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default phoneNumberInputStyles;
