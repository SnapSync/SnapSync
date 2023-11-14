import {
  View,
  Text,
  useColorMode,
  Icon,
  ChevronRightIcon,
  Divider,
} from "@gluestack-ui/themed";
import React from "react";
import snapSyncCommentStyles from "./snap_sync_comment.styles";
import UserAvatar from "../user_avatar/user_avatar.component";
import VerifiedBadge from "../verified_badge/verified_badge.component";
import { TouchableOpacity } from "react-native";
import HeartFilledIcon from "@/assets/Icons/HeartFilledIcon";

type Props = {};

const SnapSyncComment = (props: Props) => {
  const colorMode = useColorMode();

  return (
    <View style={snapSyncCommentStyles.viewContainer}>
      <View style={snapSyncCommentStyles.viewSnapSyncCommentUserInfo}>
        <UserAvatar
          size={24}
          avatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
        />
        <View style={snapSyncCommentStyles.viewUsernameAndIsVerified}>
          <Text
            style={snapSyncCommentStyles.textUsername}
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            numberOfLines={1}
          >
            ufo
          </Text>
          <VerifiedBadge size={8} />
          <Icon as={ChevronRightIcon} width={12} height={12} />
          <Text
            style={snapSyncCommentStyles.textReplyUsername}
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
            numberOfLines={1}
          >
            bocca
          </Text>
        </View>
      </View>
      <Text
        style={snapSyncCommentStyles.textComment}
        color={colorMode === "dark" ? "$textDark200" : "$textLight800"}
      >
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia unde
        incidunt nemo itaque earum alias soluta nobis, ab dolore provident sed
        beatae laudantium porro ducimus eaque fugiat et, id facilis.
      </Text>
      <View style={snapSyncCommentStyles.viewActionsAndTime}>
        <Text
          style={snapSyncCommentStyles.textTimeAndReply}
          color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
        >
          1g
        </Text>
        <TouchableOpacity>
          <Text
            style={snapSyncCommentStyles.textTimeAndReply}
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
          >
            Reply
          </Text>
        </TouchableOpacity>
        <View style={snapSyncCommentStyles.viewOwnersLikes}>
          <View>
            <UserAvatar
              size={16}
              avatarUrl="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <Icon
              as={HeartFilledIcon}
              width={9.6}
              height={9.6}
              color="$red500"
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                // left: 2,
              }}
            />
          </View>
          <View>
            <UserAvatar
              size={16}
              avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              containerStyle={{
                position: "relative",
                left: -8,
              }}
            />
            <Icon
              as={HeartFilledIcon}
              width={9.6}
              height={9.6}
              color="$red500"
              style={{
                position: "absolute",
                bottom: -2,
                // right: -0.1,
                left: 2,
              }}
            />
          </View>
        </View>
      </View>
      <View style={snapSyncCommentStyles.viewOtherReplies}>
        <Divider
          orientation={"horizontal"}
          m="$3"
          style={{
            flex: 1,
          }}
        />
        <TouchableOpacity
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={snapSyncCommentStyles.textOtherReplies}
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
          >
            View 2 other replies
          </Text>
        </TouchableOpacity>
        <Divider
          orientation={"horizontal"}
          m="$3"
          style={{
            flex: 1,
          }}
        />
      </View>
    </View>
  );
};
export default SnapSyncComment;
