import React from "react";
import { IApiUser } from "@/interfaces/users.interface";
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Pressable,
  View,
  Text,
  useColorMode,
} from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import i18n from "@/lang";

type Props = {
  isLoading?: boolean;
  mutualFriends?: IApiUser[];
  totalMutualFriends?: number;
  onPress?: () => void;
};

const SocialContext = ({
  isLoading,
  mutualFriends,
  totalMutualFriends = 0,
  onPress,
}: Props) => {
  const colorMode = useColorMode();
  if (isLoading) {
    return (
      <View
        flexDirection="row"
        alignItems="center"
        backgroundColor="transparent"
        width="$full"
        gap="$2"
      >
        <View
          flexDirection="row"
          alignItems="center"
          backgroundColor="transparent"
        >
          <View
            width={32}
            height={32}
            borderRadius="$full"
            backgroundColor="transparent"
          >
            <Skeleton
              width={32}
              height={32}
              radius="round"
              show
              colorMode={colorMode === "dark" ? "dark" : "light"}
            />
          </View>
          <View
            width={32}
            height={32}
            borderRadius="$full"
            backgroundColor="transparent"
            ml={-10}
            position="relative"
          >
            <Skeleton
              width={32}
              height={32}
              radius="round"
              show
              colorMode={colorMode === "dark" ? "dark" : "light"}
            />
          </View>
          <View
            width={32}
            height={32}
            borderRadius="$full"
            backgroundColor="transparent"
            ml={-10}
            position="relative"
          >
            <Skeleton
              width={32}
              height={32}
              radius="round"
              show
              colorMode={colorMode === "dark" ? "dark" : "light"}
            />
          </View>
        </View>
        <View backgroundColor="transparent" gap="$0.5" flex={1}>
          <Skeleton
            height={14}
            width="50%"
            show
            colorMode={colorMode === "dark" ? "dark" : "light"}
          />
          <Skeleton
            height={14}
            width="100%"
            show
            colorMode={colorMode === "dark" ? "dark" : "light"}
          />
        </View>
      </View>
    );
  }

  if (!mutualFriends || mutualFriends.length === 0) return null;

  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      backgroundColor="transparent"
      width="$full"
      gap="$2"
      onPress={onPress}
      paddingLeft={10} // Lo metto perchè avatarGroup mette come default ml = -10
    >
      <AvatarGroup>
        {mutualFriends
          ?.map((friend) => (
            <Avatar key={friend.id} size="sm">
              <AvatarFallbackText>
                {friend.username ? friend.username : friend.fullname}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: friend.profilePicture?.url,
                }}
              />
            </Avatar>
          ))
          // Mostra solo i primi 3 amici
          .slice(0, 3)}
      </AvatarGroup>
      <View backgroundColor="transparent" flex={1}>
        <Text size="md" fontFamily="Inter_600SemiBold">
          {i18n.t("userProfileScreenScreen.socialContext.mutualFriends", {
            count: totalMutualFriends,
          })}
        </Text>
        <Text size="sm" fontFamily="Inter_400Regular">
          {mutualFriends
            ?.map((friend, index) => (
              <Text key={friend.id} size="sm" fontFamily="Inter_400Regular">
                {friend.username}
                {index === mutualFriends.length - 1 ? " " : ", "}
              </Text>
            ))
            // Mostra solo i primi 3 amici
            .slice(0, 3)}
          {totalMutualFriends > 3 ? "..." : ""}
        </Text>
      </View>
    </Pressable>
  );
};

export default SocialContext;
