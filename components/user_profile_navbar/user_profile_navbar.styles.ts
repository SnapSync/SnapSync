import { StyleSheet } from "react-native";

const userProfileNavBarStyles = StyleSheet.create({
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    gap: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    elevation: 1,
    zIndex: 1,
  },
  viewUsernameAndIsVerified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  textUsername: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
});

export default userProfileNavBarStyles;
