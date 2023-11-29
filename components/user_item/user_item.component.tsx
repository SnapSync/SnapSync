import { IApiUser } from "@/interfaces/users.interface";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Divider,
  View,
  Text,
  Icon,
  CloseCircleIcon,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import userItemStyles from "./user_item.styles";
import { Skeleton } from "moti/skeleton";
import { Contact2Icon, UserMinus2Icon, Verified } from "lucide-react-native";
import i18n from "@/lang";

type Props = {
  user?: IApiUser;
  isLoading?: boolean;
  disabled?: boolean;

  onPress?: () => void;

  withDarkMode?: boolean;

  showUnfriendButton?: boolean;
  onPressUnfriend?: () => void;

  showAcceptRequestButton?: boolean;
  onPressAcceptRequest?: () => void;

  showCancelRequestButton?: boolean;
  onPressCancelRequest?: () => void;

  showSendRequestButton?: boolean;
  onPressSendRequest?: () => void;
};

const UserItem = ({
  user,
  isLoading = false,
  disabled = false,
  onPress,
  withDarkMode = false,
  showUnfriendButton = false,
  onPressUnfriend,
  showAcceptRequestButton = false,
  onPressAcceptRequest,
  showCancelRequestButton = false,
  onPressCancelRequest,
  showSendRequestButton = false,
  onPressSendRequest,
}: Props) => {
  return (
    <TouchableOpacity
      style={userItemStyles.container}
      onPress={onPress}
      disabled={disabled}
    >
      <Skeleton width={32} height={32} radius="round" show={isLoading}>
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
      <View style={userItemStyles.infoContainer}>
        <View style={userItemStyles.usernameAndIsVerifiedAndStreakContainer}>
          <Skeleton show={isLoading}>
            <Text
              numberOfLines={1}
              style={userItemStyles.username}
              color={withDarkMode ? "$textDark0" : "$textLight950"}
            >
              {user?.username}
            </Text>
          </Skeleton>
          {user?.isVerified ? (
            <Icon
              as={Verified}
              size="2xs"
              color={withDarkMode ? "$textDark0" : "$textLight950"}
            />
          ) : null}
          {user && user.streak && user.streak > 0 ? (
            <Text
              color={withDarkMode ? "$textDark400" : "$textLight700"}
              style={userItemStyles.streak}
            >
              • {user.streak} 🔥
            </Text>
          ) : null}
        </View>
        <Skeleton show={isLoading}>
          <Text
            numberOfLines={1}
            style={userItemStyles.fullname}
            color={withDarkMode ? "$textDark400" : "$textLight700"}
          >
            {user?.fullname}
          </Text>
        </Skeleton>
        {user && user.contactNickname ? (
          <View style={userItemStyles.contactNicknameContainer}>
            <Icon
              as={Contact2Icon}
              size="2xs"
              color={withDarkMode ? "$textDark400" : "$textLight700"}
            />
            <Text
              numberOfLines={1}
              style={userItemStyles.contactNickname}
              color={withDarkMode ? "$textDark400" : "$textLight700"}
            >
              {user.contactNickname}
            </Text>
          </View>
        ) : null}
      </View>
      {showUnfriendButton ? (
        <TouchableOpacity onPress={onPressUnfriend}>
          <Icon
            as={UserMinus2Icon}
            size="md"
            color={withDarkMode ? "$error400" : "$error700"}
          />
        </TouchableOpacity>
      ) : null}
      {showAcceptRequestButton ? (
        <Button
          onPress={onPressAcceptRequest}
          size="xs"
          action="secondary"
          borderRadius={14}
        >
          <ButtonText fontFamily="Inter-SemiBold">
            {i18n.t("profile.friendship.accept")}
          </ButtonText>
        </Button>
      ) : null}
      {showCancelRequestButton ? (
        <TouchableOpacity onPress={onPressCancelRequest}>
          <Icon
            as={CloseCircleIcon}
            size="md"
            color={withDarkMode ? "$textDark0" : "$textLight950"}
          />
        </TouchableOpacity>
      ) : null}
      {showSendRequestButton ? (
        <Button
          onPress={onPressSendRequest}
          size="xs"
          action="secondary"
          borderRadius={14}
        >
          <ButtonText fontFamily="Inter-SemiBold">
            {i18n.t("profile.friendship.add")}
          </ButtonText>
        </Button>
      ) : null}
    </TouchableOpacity>
  );
};

export default UserItem;
