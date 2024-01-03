import React from "react";
import { IUserProfilePicture } from "@/interfaces/users.interface";
import { Skeleton } from "moti/skeleton";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import { Verified } from "lucide-react-native";

type Props = {
  isLoading?: boolean;
  username?: string;
  fullname?: string;
  isVerified?: boolean;
  profilePicture?: IUserProfilePicture | null;
};

const UserProfileHeaderAvatar = ({
  isLoading,
  username,
  fullname,
  isVerified,
  profilePicture,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <Skeleton
      width={96}
      height={96}
      radius="round"
      show={isLoading}
      colorMode={colorMode === "dark" ? "dark" : "light"}
    >
      {/* <View width={96} height={96} borderRadius="$full" backgroundColor="red" /> */}
      <Avatar size="xl">
        <AvatarFallbackText>{username || fullname}</AvatarFallbackText>
        {profilePicture ? (
          <AvatarImage
            source={{
              uri: profilePicture?.url,
            }}
          />
        ) : null}

        {!isLoading && isVerified ? (
          <AvatarBadge
            bgColor={
              colorMode === "dark" ? "$backgroundDark950" : "$backgroundLight0"
            }
            alignItems="center"
            justifyContent="center"
            borderWidth={0}
          >
            <Icon
              as={Verified}
              size="sm"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          </AvatarBadge>
        ) : null}
      </Avatar>
    </Skeleton>
  );
};

export default UserProfileHeaderAvatar;
