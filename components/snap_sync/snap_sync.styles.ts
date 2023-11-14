import { StyleSheet } from "react-native";

const snapSyncStyles = StyleSheet.create({
  viewAddComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    paddingVertical: 10,
    gap: 10,
  },
  textAddComment: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
});

export default snapSyncStyles;
