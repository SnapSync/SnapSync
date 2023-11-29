import { StyleSheet } from "react-native";

const userItemStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginVertical: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    minHeight: 50,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 3,
  },
  usernameAndIsVerifiedAndStreakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
    backgroundColor: "transparent",
  },
  username: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  streak: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    fontStyle: "normal",
    lineHeight: 16,
  },
  fullname: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 16,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  contactNicknameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
    backgroundColor: "transparent",
  },
  contactNickname: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 16,
    flexWrap: "wrap",
    flexShrink: 1,
  },
});

export default userItemStyles;
