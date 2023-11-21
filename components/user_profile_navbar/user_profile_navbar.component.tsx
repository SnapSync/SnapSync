import { Layout } from "@/costants/Layout";
import {
  ChevronLeftIcon,
  Icon,
  ThreeDotsIcon,
  View,
  Text,
} from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import userProfileNavBarStyles from "./user_profile_navbar.styles";
import VerifiedBadge from "../verified_badge/verified_badge.component";

type Props = {
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

  /**
   * @description
   * Callback fired when the back button is pressed.
   * @optional
   * @type () => void
   * @example
   * ```tsx
   * <UserProfileTopHeader onPressBack={() => console.log("Back button pressed")} />
   * ```
   * @returns void
   */
  onPressBack?: () => void;

  /**
   * @description
   * Callback fired when the options button is pressed.
   * @optional
   * @type () => void
   * @example
   * ```tsx
   * <UserProfileTopHeader onPressOptions={() => console.log("Options button pressed")} />
   * ```
   * @returns void
   */
  onPressOptions?: () => void;

  /**
   * @description
   * If true, the dark mode is enabled.
   * @default false
   * @optional
   * @type boolean
   * @example
   * ```tsx
   * <UserProfileTopHeader withDarkMode />
   * ```
   */
  withDarkMode?: boolean;
};

const UserProfileNavBar = (props: Props) => {
  const {
    username,
    isVerified = false,
    onPressBack,
    onPressOptions,
    withDarkMode = false,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: insets.right + Layout.DefaultMarginHorizontal,
          paddingTop: insets.top,
          height: insets.top + 40,
        },
        userProfileNavBarStyles.viewContainer,
      ]}
    >
      <TouchableOpacity onPress={onPressBack}>
        <Icon
          as={ChevronLeftIcon}
          size="sm"
          color={withDarkMode ? Layout.LightBgc : Layout.DarkBgc}
        />
      </TouchableOpacity>
      <View style={userProfileNavBarStyles.viewUsernameAndIsVerified}>
        <Text
          style={userProfileNavBarStyles.textUsername}
          numberOfLines={1}
          color={withDarkMode ? "$textDark0" : "$textLight950"}
        >
          {username}
        </Text>
        {isVerified && <VerifiedBadge size={8} />}
      </View>
      <TouchableOpacity onPress={onPressOptions}>
        <Icon
          as={ThreeDotsIcon}
          size="sm"
          color={withDarkMode ? Layout.LightBgc : Layout.DarkBgc}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserProfileNavBar;
