import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import listHeaderStyles from "./list_header.styles";
import { ChevronRightIcon, Icon, View, Text } from "@gluestack-ui/themed";
import i18n from "@/lang";

type Props = {
  count?: number;
  onPress: () => void;
  withDarkMode?: boolean;
};

const ListHeader = ({ count = 0, onPress, withDarkMode = false }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={listHeaderStyles.container}>
      <View style={listHeaderStyles.textContainer}>
        <Text style={listHeaderStyles.title}>
          {i18n.t("incomingFriendRequests.listHeaderTitle")}{" "}
          {count > 0 ? `(${count})` : ""}
        </Text>
        <Text style={listHeaderStyles.body} numberOfLines={2}>
          {i18n.t("incomingFriendRequests.listHeaderBody")}
        </Text>
      </View>
      <Icon as={ChevronRightIcon} size="xl" />
    </TouchableOpacity>
  );
};

export default ListHeader;
