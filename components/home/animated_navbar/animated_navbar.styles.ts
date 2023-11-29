import { StyleSheet } from "react-native";

const animatedNavbarStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // height: 56,
  },
  section: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  badge: {
    position: "relative",
    width: 6,
    height: 6,
    top: 6,
    right: -18,
    zIndex: 1,
    borderRadius: 50,
    elevation: 1,
  },
  left: {
    alignItems: "flex-start",
    // paddingLeft: Layout.DefaultMarginHorizontal,
  },
  right: {
    alignItems: "flex-end",
    // paddingRight: Layout.DefaultMarginHorizontal,
  },
});

export default animatedNavbarStyles;
