import { IFriendshipStatus } from "@/interfaces/friendship_status.interface";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
  CloseCircleIcon,
  Text,
  View,
} from "@gluestack-ui/themed";
import React from "react";
import friendshipStatusStyles from "./friendship_status.styles";
import { Skeleton } from "moti/skeleton";
import i18n from "@/lang";
import { UserCheck2Icon, UserPlus2Icon, UserX2Icon } from "lucide-react-native";

type Props = {
  username?: string;
  friendshipStatus?: IFriendshipStatus;
  isLoading?: boolean;

  variant?: "add" | "incoming" | "outgoing";

  withDarkMode?: boolean;
};

const FriendshipStatus = ({
  username,
  friendshipStatus,
  isLoading,
  variant,

  withDarkMode = false,
}: Props) => {
  if (isLoading && variant) {
    // Mostro il loader in base alla variante
    if (variant === "incoming") {
      return (
        <View
          style={[friendshipStatusStyles.incomingContainer]}
          bgColor={withDarkMode ? "$backgroundDark700" : "$backgroundLight100"}
        >
          <Skeleton
            colorMode={withDarkMode ? "dark" : "light"}
            width={"100%"}
            height={12}
          />
          <ButtonGroup style={friendshipStatusStyles.buttonGroup}>
            <Button
              size="lg"
              borderRadius={14}
              variant="solid"
              width="40%"
              action="secondary"
            />
            <Button
              size="lg"
              borderRadius={14}
              variant="outline"
              width="40%"
              action="secondary"
            />
          </ButtonGroup>
        </View>
      );
    } else if (variant === "outgoing") {
      return (
        <Skeleton show={true}>
          <Button
            size="lg"
            borderRadius={14}
            variant="solid"
            width="100%"
            action="secondary"
          />
        </Skeleton>
      );
    } else if (variant === "add") {
      return (
        <Skeleton show={true}>
          <Button
            size="lg"
            borderRadius={14}
            variant="solid"
            width="100%"
            action="secondary"
          />
        </Skeleton>
      );
    } else return null;
  }

  // Se sono amici oppure l'utente è bloccato non mostro nulla
  if (
    !friendshipStatus ||
    friendshipStatus.isFriend ||
    friendshipStatus.isBlocking
  )
    return null;

  // Se ho ricevuto una richiesta di amicizia
  if (friendshipStatus.incomingRequest) {
    return (
      <View
        style={[friendshipStatusStyles.incomingContainer]}
        bgColor={withDarkMode ? "$backgroundDark700" : "$backgroundLight100"}
      >
        <Text
          fontFamily="Inter-SemiBold"
          fontSize={14}
          color={withDarkMode ? "$textDark0" : "$textLight950"}
        >
          {i18n.t("profile.friendship.received", {
            username: username,
          })}
        </Text>
        <ButtonGroup style={friendshipStatusStyles.buttonGroup}>
          <Button
            size="lg"
            borderRadius={14}
            variant="solid"
            width="40%"
            action="secondary"
            gap={10}
          >
            <ButtonIcon
              as={UserCheck2Icon}
              size="sm"
              // color={withDarkMode ? "$textDark0" : "$textLight950"}
            />
            <ButtonText fontFamily="Inter-SemiBold">
              {i18n.t("profile.friendship.accept")}
            </ButtonText>
          </Button>
          <Button
            size="lg"
            borderRadius={14}
            variant="outline"
            width="40%"
            action="secondary"
            gap={10}
          >
            <ButtonIcon
              as={UserX2Icon}
              size="sm"
              // color={withDarkMode ? "$textDark0" : "$textLight950"}
            />
            <ButtonText fontFamily="Inter-SemiBold">
              {i18n.t("profile.friendship.deny")}
            </ButtonText>
          </Button>
        </ButtonGroup>
      </View>
    );
  }

  // Se ho inviato una richiesta di amicizia
  if (friendshipStatus.outgoingRequest) {
    return (
      <Button action="secondary" size="lg" borderRadius={14} gap={10}>
        <ButtonIcon as={CloseCircleIcon} size="sm" />
        <ButtonText fontFamily="Inter-SemiBold">
          {i18n.t("profile.friendship.cancel")}
        </ButtonText>
      </Button>
    );
  }

  return (
    <Button action="secondary" size="lg" borderRadius={14} gap={10}>
      <ButtonIcon as={UserPlus2Icon} size="sm" />
      <ButtonText fontFamily="Inter-SemiBold">
        {i18n.t("profile.friendship.add")}
      </ButtonText>
    </Button>
  );
};

export default FriendshipStatus;
