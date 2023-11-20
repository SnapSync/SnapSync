import { Animated, Text, View } from "react-native";
import React from "react";

type Props = {
  /**
   * @description
   * The scroll animation.
   * @type Animated.Value
   * @example
   * ```tsx
   * <UserProfileTopHeader scrollA={scrollA} />
   * ```
   */
  scrollA: Animated.Value;

  /**
   * @description
   * If true, the component will be rendered with dark mode.
   * @default false
   * @optional
   * @type boolean
   * @example
   * ```tsx
   * <UserProfileTopHeader withDarkMode />
   * ```
   */
  withDarkMode?: boolean;

  /**
   * @description
   * The username of the user.
   * @optional
   * @type string
   * @example
   * ```tsx
   * <UserProfileTopHeader username="username" />
   * ```
   */
  username?: string;

  /**
   * @description
   * If true, the user is verified.
   * @default false
   * @optional
   * @type boolean
   * @example
   * ```tsx
   * <UserProfileTopHeader isVerified />
   * ```
   */
  isVerified?: boolean;
};

const UserProfileTopHeader = (props: Props) => {
  const { withDarkMode = false, username, isVerified = false } = props;

  return (
    <></>
    // <View
    //       style={{
    //         flexDirection: "row",
    //         alignItems: "center",
    //         justifyContent: "space-between",
    //         backgroundColor: "red",
    //         paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
    //         paddingRight: insets.right + Layout.DefaultMarginHorizontal,
    //         paddingTop: insets.top,
    //         height: insets.top + 40,
    //         gap: 16,
    //         position: "absolute",
    //         top: 0,
    //         left: 0,
    //         right: 0,
    //         elevation: 1,
    //         zIndex: 1,
    //       }}
    //     >
    //       <TouchableOpacity onPress={goBack}>
    //         <Icon as={ChevronLeftIcon} size="sm" color={Layout.LightBgc} />
    //       </TouchableOpacity>
    //       <View
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //           gap: 3,
    //           backgroundColor: "transparent",
    //           flex: 1,
    //           justifyContent: "center",
    //         }}
    //       >
    //         <Text
    //           style={{
    //             fontFamily: "Inter-Bold",
    //             fontSize: 14,
    //             fontStyle: "normal",
    //             fontWeight: "700",
    //             lineHeight: 20,
    //             flexWrap: "wrap",
    //             flexShrink: 1,
    //           }}
    //           numberOfLines={1}
    //         >
    //           {data?.username}
    //         </Text>
    //         {data?.isVerified && <VerifiedBadge size={8} />}
    //       </View>
    //       <TouchableOpacity onPress={() => console.log("Options")}>
    //         <Icon as={ThreeDotsIcon} size="sm" color={Layout.LightBgc} />
    //       </TouchableOpacity>
    //     </View>
  );
};

export default UserProfileTopHeader;
