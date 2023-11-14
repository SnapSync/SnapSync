import { Layout } from "@/costants/Layout";
import { SCREEN_WIDTH } from "@/utils/helper";
import { StyleSheet } from "react-native";

const otpStyles = StyleSheet.create({
  viewOptInputContainer: {
    // width: VIEW_COUNTRY_INFO_WIDTH,
    // height: 36,
    // padding: 10,
    // borderRadius: 12,
    // alignItems: "center",
    // justifyContent: "space-between",
    flexDirection: "row",
    gap: 16,
    borderWidth: 1,
    // width: SCREEN_WIDTH - Layout.DefaultMarginHorizontal * 2,
    // height: 48,
    backgroundColor: "red",
  },
});

export default otpStyles;
