import { StyleSheet } from "react-native";

const animatedTabBarStyles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 50,
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    borderRadius: 50,
  },
  text: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    fontStyle: "normal",
    lineHeight: 16,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});

export default animatedTabBarStyles;
