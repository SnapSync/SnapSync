import {
  SCREEN_HEIGHT,
  SCREEN_HORIENTATION,
  SCREEN_WIDTH,
} from "@/utils/helper";
import { View, Text, useColorMode } from "@gluestack-ui/themed";
import React from "react";
import snapSyncStyles from "./snap_sync.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import UserAvatar from "../user_avatar/user_avatar.component";
import { TouchableOpacity } from "react-native";
import SnapSyncSlider from "../snap_sync_slider/snap_sync_slider.component";
import { ISnapSync } from "@/interfaces/snap_sync.interface";
import SnapSyncUser from "../snap_sync_user/snap_sync_user.component";

type Props = {
  snapSync: ISnapSync;
};

const SnapSync = ({ snapSync }: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const SnapSyncSize = React.useMemo(() => {
    return SCREEN_HORIENTATION === "PORTRAIT" ? SCREEN_WIDTH : SCREEN_HEIGHT;
  }, [SCREEN_HORIENTATION, SCREEN_WIDTH, SCREEN_HEIGHT]);

  return (
    <View
      style={{
        width: SnapSyncSize,
      }}
    >
      <SnapSyncUser
        user={snapSync.owner}
        isOwner={true}
        onPressUser={() => {}}
        onPressOptions={() => {}}
      />
      <SnapSyncSlider
        size={SnapSyncSize}
        leftImageUrl={snapSync.owner.imageUrl}
        leftImageBlurHash={snapSync.owner.imageBlurhash}
        rightImageUrl={snapSync.member.imageUrl}
        rightImageBlurHash={snapSync.member.imageBlurhash}
        onPressReactions={() => {}}
        onPressComments={() => {}}
      />
      <SnapSyncUser
        user={snapSync.member}
        isOwner={false}
        onPressUser={() => {}}
      />
      <View
        style={[
          snapSyncStyles.viewAddComment,
          {
            paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
            paddingRight: insets.right + Layout.DefaultMarginHorizontal,
          },
        ]}
      >
        <UserAvatar
          size={24}
          avatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
        />
        <TouchableOpacity>
          <Text
            style={snapSyncStyles.textAddComment}
            numberOfLines={1}
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
          >
            Add a comment...
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SnapSync;
