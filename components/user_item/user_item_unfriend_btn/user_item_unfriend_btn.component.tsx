import i18n from "@/lang";
import { Button, ButtonText } from "@gluestack-ui/themed";
import React from "react";

type Props = {
  onPress?: () => void;
};

const UserItemUnfriendBtn = ({ onPress }: Props) => {
  return (
    <Button onPress={onPress} size="xs" borderRadius="$full" action="negative">
      <ButtonText>{i18n.t("remove")}</ButtonText>
    </Button>
  );
};

export default UserItemUnfriendBtn;
