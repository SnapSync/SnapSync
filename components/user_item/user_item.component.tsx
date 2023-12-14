import { IApiUser } from "@/interfaces/users.interface";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider,
  View,
  Text,
  Icon,
  useColorMode,
  AvatarBadge,
  Pressable,
} from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Skeleton } from "moti/skeleton";
import { Contact2Icon, Verified } from "lucide-react-native";
import i18n from "@/lang";

export const USER_ITEM_MIN_HEIGHT = 50;

type Props = {
  user?: IApiUser;
  isLoading?: boolean;
  disabled?: boolean;

  onPress?: () => void;
};

const UserItem = ({
  user,
  isLoading = false,
  disabled = false,
  onPress,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      gap="$2"
      marginVertical="$3"
      flexDirection="row"
      minHeight={USER_ITEM_MIN_HEIGHT}
      alignItems="center"
      flex={1}
      backgroundColor="transparent"
    >
      <Skeleton
        width={48}
        height={48}
        radius="round"
        show={isLoading}
        colorMode={colorMode === "dark" ? "dark" : "light"}
      >
        <Avatar size="md">
          <AvatarFallbackText>
            {user?.username || user?.fullname}
          </AvatarFallbackText>
          <AvatarImage
            source={{
              uri: user?.profilePicture?.url,
            }}
          />
          {!isLoading && user && user.isVerified ? (
            <AvatarBadge
              alignItems="center"
              justifyContent="center"
              borderWidth={0}
              bgColor={
                colorMode === "dark"
                  ? "$backgroundDark950"
                  : "$backgroundLight0"
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

      <Divider orientation="vertical" />

      <View
        flex={1}
        gap="$2"
        flexDirection="column"
        backgroundColor="transparent"
      >
        <Skeleton
          width={"100%"}
          height={22}
          colorMode={colorMode === "dark" ? "dark" : "light"}
          show={isLoading}
        >
          <Text
            isTruncated
            flexShrink={1}
            fontFamily="Inter_600SemiBold"
            size="md"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          >
            {user?.username}
          </Text>
        </Skeleton>

        <Skeleton
          show={isLoading}
          width={"100%"}
          height={20}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Text
            isTruncated
            flexShrink={1}
            size="sm"
            fontFamily="Inter_400Regular"
          >
            {user?.fullname}
          </Text>
        </Skeleton>
        {user ? (
          user.streak && user.streak > 0 ? (
            <Text
              isTruncated
              flexShrink={1}
              size="sm"
              fontFamily="Inter_400Regular"
            >
              {user.streak} 🔥
            </Text>
          ) : user.mutualFriends ? (
            <Text
              isTruncated
              flexShrink={1}
              size="sm"
              fontFamily="Inter_400Regular"
            >
              {user.mutualFriends > 20
                ? `🤝 ${i18n.t("lotOfMutualFriends")}`
                : `🤝 ${i18n.t("mutualFriends", {
                    count: user.mutualFriends,
                  })}`}
            </Text>
          ) : null
        ) : null}
      </View>
    </Pressable>
  );
};

export default UserItem;
