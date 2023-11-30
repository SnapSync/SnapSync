import { StyleSheet } from "react-native";

const listHeaderStyles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    // padding: 10,
  },
  textContainer: {
    // gap: 10,
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    fontStyle: "normal",
    lineHeight: 19,
  },
  body: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    fontStyle: "normal",
    lineHeight: 17,
  },
});

export default listHeaderStyles;
