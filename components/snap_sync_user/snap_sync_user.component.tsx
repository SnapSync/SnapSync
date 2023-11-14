import { TouchableOpacity } from "react-native";
import React from "react";
import { ISnapSyncUser } from "@/interfaces/snap_sync.interface";
import snapSyncUserStyles from "./snap_sync_user.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Divider,
  View,
  useColorMode,
  Text,
  Icon,
  ThreeDotsIcon,
} from "@gluestack-ui/themed";
import { Layout } from "@/costants/Layout";
import UserAvatar from "../user_avatar/user_avatar.component";
import VerifiedBadge from "../verified_badge/verified_badge.component";

type Props = {
  user: ISnapSyncUser;
  isOwner: boolean;
  onPressOptions?: () => void;
  onPressUser?: () => void;
};

const SnapSyncUser = ({
  user,
  isOwner,
  onPressOptions,
  onPressUser,
}: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  return (
    <View
      style={[
        snapSyncUserStyles.viewContainer,
        {
          paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: insets.right + Layout.DefaultMarginHorizontal,
        },
      ]}
    >
      {isOwner ? (
        <>
          <UserAvatar
            size={36}
            avatarUrl={user.avatarUrl}
            avatarBlurHash={user.avatarBlurHash}
          />
          <Divider orientation="vertical" />
          <TouchableOpacity
            style={[
              snapSyncUserStyles.viewUserInfo,
              {
                alignItems: isOwner ? "flex-start" : "flex-end",
              },
            ]}
            onPress={onPressUser}
          >
            <View style={snapSyncUserStyles.viewUsernameAndIsVerified}>
              <Text
                style={snapSyncUserStyles.textUsername}
                numberOfLines={1}
                color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
              >
                {user.username}
              </Text>
              {user.isVerified && <VerifiedBadge size={8} />}
            </View>
            {user.location && (
              <Text
                style={snapSyncUserStyles.textLocation}
                numberOfLines={1}
                color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
              >
                {user.location.name}
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[
              snapSyncUserStyles.viewUserInfo,
              {
                alignItems: isOwner ? "flex-start" : "flex-end",
              },
            ]}
            onPress={onPressUser}
          >
            <View style={snapSyncUserStyles.viewUsernameAndIsVerified}>
              <Text
                style={snapSyncUserStyles.textUsername}
                numberOfLines={1}
                color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
              >
                {user.username}
              </Text>
              {user.isVerified && <VerifiedBadge size={8} />}
            </View>
            {user.location && (
              <Text
                style={snapSyncUserStyles.textLocation}
                numberOfLines={1}
                color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
              >
                {user.location.name}
              </Text>
            )}
          </TouchableOpacity>
          <Divider orientation="vertical" />
          <UserAvatar
            size={36}
            avatarUrl={user.avatarUrl}
            avatarBlurHash={user.avatarBlurHash}
          />
        </>
      )}

      {isOwner && (
        <TouchableOpacity
          style={snapSyncUserStyles.viewOptions}
          onPress={onPressOptions}
        >
          <Icon
            as={ThreeDotsIcon}
            width={16}
            color={colorMode === "dark" ? Layout.LightBgc : Layout.DarkBgc}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SnapSyncUser;
