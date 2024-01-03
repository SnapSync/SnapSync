import { IApiUser } from "@/interfaces/users.interface";
import { Divider, Text } from "@gluestack-ui/themed";
import React, { memo } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import UserItemAvatar from "./user_item_avatar/user_item_avatar.component";
import UserItemInfo from "./user_item_info/user_item_info.component";
import UserItemUnfriendBtn from "./user_item_unfriend_btn/user_item_unfriend_btn.component";

export const USER_ITEM_MIN_HEIGHT = 50;

type Props = {
  isLoading?: boolean;
  disabled?: boolean;

  user?: IApiUser;

  fsBtn?: "unfried" | "add" | "unblock" | "received" | "send";

  onPress?: (user?: IApiUser) => void;
  onPressUnfriend?: (user: IApiUser) => void;
};

const UserItem = ({
  user,
  isLoading = false,
  disabled = false,
  fsBtn,
  onPress,
  onPressUnfriend,
}: Props) => {
  const _onPress = () => onPress?.(user);

  const _onPressUnfriend = () => {
    if (!user) return;
    onPressUnfriend?.(user);
  };

  return (
    <TouchableOpacity
      onPress={_onPress}
      disabled={disabled}
      style={styles.container}
    >
      <UserItemAvatar
        isLoading={isLoading}
        profilePicture={user?.profilePicture}
        username={user?.username}
        fullname={user?.fullname}
        isVerified={user?.isVerified}
      />
      <Divider orientation="vertical" />

      <UserItemInfo
        isLoading={isLoading}
        username={user?.username}
        fullname={user?.fullname}
        mutualFriends={user?.mutualFriends}
      />

      {fsBtn ? (
        fsBtn === "unfried" ? (
          <UserItemUnfriendBtn onPress={_onPressUnfriend} />
        ) : null
      ) : null}
    </TouchableOpacity>
  );
};

export default memo(UserItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    minHeight: USER_ITEM_MIN_HEIGHT,
    flex: 1,
    gap: 8, // "$2"
    marginVertical: 10, // "$2.5"
  },
});
