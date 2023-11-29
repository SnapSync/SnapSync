import { StyleSheet } from "react-native";

const fixedNavbarStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  section: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  left: {
    alignItems: "flex-start",
  },
  center: {
    flex: 2,
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    alignItems: "flex-end",
  },
  username: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    fontStyle: "normal",
  },
});

export default fixedNavbarStyles;
