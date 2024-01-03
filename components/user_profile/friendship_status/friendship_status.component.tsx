import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  Text,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import React from "react";
import { Skeleton } from "moti/skeleton";
import i18n from "@/lang";
import {
  Clock1Icon,
  UserCheck2Icon,
  UserPlus2Icon,
  UserX2Icon,
} from "lucide-react-native";
import { FriendshipStatusResponse } from "@/api/types";

type Props = {
  username?: string;
  friendshipStatus?: FriendshipStatusResponse;
  isLoading?: boolean;

  variant?: "add" | "incoming" | "outgoing";

  onPressAdd?: () => void;
  isLoadingAdd?: boolean;

  onPressAccept?: () => void;
  isLoadingAccept?: boolean;

  onPressDeny?: () => void;
  isLoadingDeny?: boolean;

  onPressCancel?: () => void;
  isLoadingCancel?: boolean;
};

const FriendshipStatus = ({
  username,
  friendshipStatus,
  isLoading = false,
  variant,

  onPressAdd,
  isLoadingAdd = false,

  onPressAccept,
  isLoadingAccept = false,

  onPressDeny,
  isLoadingDeny = false,

  onPressCancel,
  isLoadingCancel = false,
}: Props) => {
  const colorMode = useColorMode();

  if (isLoading && variant) {
    // Mostro il loader in base alla variante
    if (variant === "incoming") {
      return (
        <View
          width="100%"
          minHeight={120}
          paddingHorizontal={15}
          paddingVertical={15}
          borderColor={
            colorMode === "dark" ? "$borderDark400" : "$borderLight700"
          }
          borderRadius={20}
          borderWidth={0.5}
          alignItems="center"
          gap={20}
        >
          <Skeleton
            height={14}
            width={"100%"}
            colorMode={colorMode === "dark" ? "dark" : "light"}
          />

          <View
            width="100%"
            gap={10}
            flexDirection="row"
            alignItems="center"
            backgroundColor="transparent"
          >
            <View flex={1} backgroundColor="transparent">
              <Skeleton
                show
                colorMode={colorMode === "dark" ? "dark" : "light"}
              >
                <Button
                  size="lg"
                  rounded="$lg"
                  width="100%"
                  action="secondary"
                />
              </Skeleton>
            </View>
            <View flex={1} backgroundColor="transparent">
              <Skeleton
                show
                colorMode={colorMode === "dark" ? "dark" : "light"}
              >
                <Button size="lg" rounded="$lg" width="100%" action="primary" />
              </Skeleton>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <Skeleton show colorMode={colorMode === "dark" ? "dark" : "light"}>
          <Button size="lg" rounded="$lg" action="secondary" />
        </Skeleton>
      );
    }
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
        width="100%"
        minHeight={120}
        paddingHorizontal={15}
        paddingVertical={15}
        borderColor={
          colorMode === "dark" ? "$borderDark400" : "$borderLight700"
        }
        borderRadius={20}
        borderWidth={0.5}
        alignItems="center"
        gap={20}
      >
        <Text
          // fontFamily="Inter-SemiBold"
          fontSize="$md"
          lineHeight="$md"
          color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
        >
          {i18n.t("userProfileScreen.friendship.received", {
            username: username,
          })}
        </Text>
        <View
          width="100%"
          gap={10}
          flexDirection="row"
          alignItems="center"
          backgroundColor="transparent"
        >
          <View flex={1} backgroundColor="transparent">
            <Button
              size="lg"
              rounded="$lg"
              width="100%"
              action="secondary"
              variant="solid"
              onPress={onPressAccept}
            >
              {isLoadingAccept || isLoadingDeny ? (
                <ButtonSpinner />
              ) : (
                <>
                  <ButtonIcon as={UserCheck2Icon} />
                  <ButtonText>
                    {i18n.t("userProfileScreen.friendship.accept")}
                  </ButtonText>
                </>
              )}
            </Button>
          </View>
          <View flex={1} backgroundColor="transparent">
            <Button
              size="lg"
              rounded="$lg"
              width="100%"
              action="secondary"
              variant="outline"
              onPress={onPressDeny}
            >
              {isLoadingAccept || isLoadingDeny ? (
                <ButtonSpinner />
              ) : (
                <>
                  <ButtonIcon as={UserX2Icon} />
                  <ButtonText>
                    {i18n.t("userProfileScreen.friendship.deny")}
                  </ButtonText>
                </>
              )}
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Button
      size="lg"
      rounded="$lg"
      width="100%"
      action="secondary"
      variant="solid"
      onPress={() => {
        if (friendshipStatus.outgoingRequest) onPressCancel?.();
        else onPressAdd?.();
      }}
    >
      {isLoadingAdd || isLoadingCancel ? (
        <ButtonSpinner />
      ) : (
        <>
          {friendshipStatus.outgoingRequest ? (
            <ButtonIcon as={Clock1Icon} />
          ) : (
            <ButtonIcon as={UserPlus2Icon} />
          )}
          <ButtonText>
            {friendshipStatus.outgoingRequest
              ? i18n.t("userProfileScreen.friendship.cancel")
              : i18n.t("userProfileScreen.friendship.add")}
          </ButtonText>
        </>
      )}
    </Button>
  );
};

export default FriendshipStatus;
