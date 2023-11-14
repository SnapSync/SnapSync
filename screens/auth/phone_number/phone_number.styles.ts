import { Layout } from "@/costants/Layout";
import { SCREEN_WIDTH } from "@/utils/helper";
import { StyleSheet } from "react-native";

export const PHONE_NUMBER_INPUT_GAP = 16;
export const VIEW_COUNTRY_INFO_WIDTH = 62;

const phoneNumberStyles = StyleSheet.create({
  viewCountryInfo: {
    // width: VIEW_COUNTRY_INFO_WIDTH,
    // height: 36,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "row",
    gap: 0,
    borderWidth: 1,
    // marginRight: 5,
  },
  viewCountryInfoLight: {
    backgroundColor: "rgba(252, 252, 252, 0.60)",
    borderColor: "#F5F5F5", // BorderColorLight50
  },
  viewCountryInfoDark: {
    backgroundColor: "rgba(23, 23, 23, 0.60)",
    borderColor: "#262626", // BorderColorDark900
  },
});

export default phoneNumberStyles;
