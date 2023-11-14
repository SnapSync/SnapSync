import { StyleSheet } from "react-native";

const snapSyncUserStyles = StyleSheet.create({
  viewContainer: {
    height: 52,
    flexDirection: "row",
    paddingVertical: 6,
    gap: 5,
    alignItems: "center",
  },
  viewUserInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: "transparent",
  },
  viewUsernameAndIsVerified: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 3,
    backgroundColor: "transparent",
  },
  textUsername: {
    fontFamily: "Inter-Bold",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  textLocation: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  viewOptions: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    backgroundColor: "transparent",
  },
});

export default snapSyncUserStyles;
