import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  viewHeader: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
    gap: 16,
  },
  viewFooter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "stretch",
    backgroundColor: "transparent",
    flex: 1,
  },
  viewFormHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 8,
  },
  textTitle: {
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 28,
    fontFamily: "Inter-Bold",
  },
  textSubTitle: {
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },
});

export default styles;
