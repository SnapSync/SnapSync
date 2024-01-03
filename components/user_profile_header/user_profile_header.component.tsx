import { StyleSheet } from "react-native";
import React from "react";
import { IUserProfilePicture } from "@/interfaces/users.interface";
import { View } from "@gluestack-ui/themed";
import UserProfileHeaderAvatar from "./user_profile_header_avatar/user_profile_header_avatar.component";
import UserProfileHeaderFullName from "./user_profile_header_fullname/user_profile_header_fullname.component";

type Props = {
  isLoading?: boolean;
  username?: string;
  fullname?: string;
  isVerified?: boolean;
  profilePicture?: IUserProfilePicture | null;
};

const UserProfileHeader = ({
  isLoading,
  username,
  fullname,
  isVerified,
  profilePicture,
}: Props) => {
  return (
    <View style={[styles.container]}>
      <UserProfileHeaderAvatar
        isLoading={isLoading}
        username={username}
        fullname={fullname}
        isVerified={isVerified}
        profilePicture={profilePicture}
      />
      <UserProfileHeaderFullName isLoading={isLoading} fullname={fullname} />
    </View>
  );
};

export default UserProfileHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
