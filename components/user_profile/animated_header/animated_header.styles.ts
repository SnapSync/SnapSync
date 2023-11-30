import { StyleSheet } from "react-native";

const animatedHeaderStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    overflow: "hidden",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 1,
    flexDirection: "row",
    gap: 0,
    justifyContent: "space-between",
    paddingBottom: 5,
  },
  fullname: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 36,
    lineHeight: 48,
    fontWeight: "800",
  },
  streakContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 16,
  },
  streak: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});

export default animatedHeaderStyles;
