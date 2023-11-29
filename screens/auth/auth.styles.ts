import { StyleSheet } from "react-native";

export const HEADER_MAX_WIDTH = 500;

const authStyles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
    gap: 16,
    backgroundColor: "transparent",
    maxWidth: HEADER_MAX_WIDTH,
  },
  input: {
    fontSize: 28,
    fontFamily: "Inter-ExtraBold",
    lineHeight: 38,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    lineHeight: 19,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});

export default authStyles;
