import { StyleSheet } from "react-native";

const topSectionStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 8,
    backgroundColor: "transparent",
    width: "100%",
    // height: "100%",
  },
  title: {
    fontSize: 14,
    fontStyle: "normal",
    lineHeight: 28,
    fontFamily: "Inter-ExtraBold",
  },
  subTitle: {
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },
});

export default topSectionStyles;
