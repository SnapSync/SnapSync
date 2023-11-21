import { StyleSheet } from "react-native";

const userAvatarStyles = StyleSheet.create({
  viewDarkMode: {
    backgroundColor: "#252526",
    borderColor: "#404040",
    borderWidth: 0.3,
    borderStyle: "solid",
  },
  viewLightMode: {
    backgroundColor: "#FCFCFC",
    borderColor: "#E5E5E5",
    borderWidth: 0.3,
    borderStyle: "solid",
  },
  textFirstChar: {
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },
});

export default userAvatarStyles;
