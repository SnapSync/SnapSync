import { StyleSheet } from "react-native";

const animatedHeaderStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fcfcfc",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  darkMode: {
    backgroundColor: "#171717",
    borderBottomColor: "#404040",
  },
});

export default animatedHeaderStyles;
