import { HEADER_MAX_WIDTH } from "@/screens/auth/auth.styles";
import { StyleSheet } from "react-native";

const bottomSectionStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "transparent",
    flex: 1,
    maxWidth: HEADER_MAX_WIDTH,
    gap: 16,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});

export default bottomSectionStyles;
