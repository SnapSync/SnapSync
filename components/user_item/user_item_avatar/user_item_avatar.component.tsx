import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { IUserProfilePicture } from "@/interfaces/users.interface";
import { Skeleton } from "moti/skeleton";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  useColorMode,
} from "@gluestack-ui/themed";
import { Verified } from "lucide-react-native";

type Props = {
  isLoading?: boolean;
  profilePicture?: IUserProfilePicture | null;
  username?: string;
  fullname?: string;
  isVerified?: boolean;
};

const UserItemAvatar = ({
  isLoading = false,
  profilePicture,
  username,
  fullname,
  isVerified = false,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <Skeleton
      width={48}
      height={48}
      radius="round"
      show={isLoading}
      colorMode={colorMode === "dark" ? "dark" : "light"}
    >
      <Avatar size="md">
        <AvatarFallbackText>{username || fullname}</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: profilePicture?.url,
          }}
        />
        {!isLoading && isVerified ? (
          <AvatarBadge
            alignItems="center"
            justifyContent="center"
            borderWidth={0}
            bgColor={
              colorMode === "dark" ? "$backgroundDark950" : "$backgroundLight0"
            }
          >
            <Icon
              as={Verified}
              size="xs"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          </AvatarBadge>
        ) : null}
      </Avatar>
    </Skeleton>
  );
};

export default UserItemAvatar;

const styles = StyleSheet.create({});
