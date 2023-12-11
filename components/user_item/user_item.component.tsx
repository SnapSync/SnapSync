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
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        marginVertical: 10,
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        minHeight: USER_ITEM_MIN_HEIGHT,
        backgroundColor: "transparent",
        flex: 1,
      }}
    >
      <Skeleton
        width={32}
        height={32}
        radius="round"
        show={isLoading}
        colorMode={colorMode === "dark" ? "dark" : "light"}
      >
        <Avatar borderRadius="$full" size="sm">
          <AvatarFallbackText fontFamily="Inter-Bold">
            {user?.username || user?.fullname}
          </AvatarFallbackText>
          <AvatarImage
            source={{
              uri: user?.profilePicture?.url,
            }}
          />
        </Avatar>
      </Skeleton>

      <Divider orientation="vertical" />
      <View
        flex={1}
        backgroundColor="transparent"
        justifyContent="center"
        alignItems="flex-start"
        alignSelf="stretch"
        gap={3}
      >
        <View
          flexDirection="row"
          gap={3}
          alignItems="center"
          flex={1}
          backgroundColor="transparent"
        >
          {isLoading ? (
            <Skeleton
              width={"100%"}
              height={21}
              colorMode={colorMode === "dark" ? "dark" : "light"}
            />
          ) : (
            <>
              <Text
                numberOfLines={1}
                fontFamily="Inter-Bold"
                fontSize="$sm"
                lineHeight="$sm"
                flexWrap="wrap"
                flexShrink={1}
                backgroundColor="transparent"
              >
                {user?.username}
              </Text>
              {user?.isVerified ? (
                <Icon
                  as={Verified}
                  size="2xs"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
              ) : null}
            </>
          )}
          {/* {user && user.streak && user.streak > 0 ? (
            <Text
              color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
              fontFamily="Inter-SemiBold"
              fontSize="$xs"
              lineHeight="$xs"
            >
              • {user.streak} 🔥
            </Text>
          ) : null} */}
        </View>
        <Skeleton
          show={isLoading}
          width={"100%"}
          height={19}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Text
            numberOfLines={1}
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
            fontFamily="Inter-Regular"
            fontSize="$xs"
            lineHeight="$xs"
            flexWrap="wrap"
            flexShrink={1}
          >
            {user?.fullname}
          </Text>
        </Skeleton>
        {user &&
        ((user.mutualFriends && user.mutualFriends >= 20) ||
          user.contactNickname ||
          (user.streak && user.streak > 0)) ? (
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flex={1}
            backgroundColor="transparent"
          >
            {user && user.mutualFriends && user.mutualFriends >= 20 ? (
              <View
                flex={2}
                alignItems="flex-start"
                justifyContent="center"
                backgroundColor="transparent"
              >
                <Text
                  numberOfLines={1}
                  fontFamily="Inter-Regular"
                  fontSize="$xs"
                  lineHeight="$xs"
                  flexWrap="wrap"
                  flexShrink={1}
                  color={
                    colorMode === "dark" ? "$textDark400" : "$textLight700"
                  }
                >
                  {i18n.t("lotOfMutualFriends")}
                </Text>
              </View>
            ) : user && user.contactNickname ? (
              <View
                flexDirection="row"
                gap={3}
                alignItems="center"
                flex={1}
                backgroundColor="transparent"
              >
                <Icon
                  as={Contact2Icon}
                  size="2xs"
                  // color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
                />
                <Text
                  numberOfLines={1}
                  fontFamily="Inter-Regular"
                  fontSize="$xs"
                  lineHeight="$xs"
                  flexWrap="wrap"
                  flexShrink={1}
                  color={
                    colorMode === "dark" ? "$textDark400" : "$textLight700"
                  }
                >
                  {user?.contactNickname}
                </Text>
              </View>
            ) : null}
            {user && user.streak && user.streak > 0 ? (
              <View
                flex={1}
                alignItems={
                  (user && user.mutualFriends && user.mutualFriends >= 20) ||
                  (user && user.contactNickname)
                    ? "flex-end"
                    : "flex-start"
                }
                justifyContent="center"
                backgroundColor="transparent"
              >
                <Text
                  color={
                    colorMode === "dark" ? "$textDark400" : "$textLight700"
                  }
                  fontFamily="Inter-SemiBold"
                  fontSize="$xs"
                  lineHeight="$xs"
                >
                  {user.streak} 🔥
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;
