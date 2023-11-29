import { StyleSheet } from "react-native";

const animatedSearchBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // height: 72,
    // borderBottomColor: "#00000033",
    paddingTop: 100,
    // backgroundColor: "#ffffff",
  },
  search: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  cancelSearch: {
    position: "absolute",
    // marginHorizontal: 16,
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  cancelSearchText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    fontStyle: "normal",
    lineHeight: 16,
  },
});

export default animatedSearchBarStyles;
