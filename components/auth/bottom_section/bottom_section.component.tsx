import {
  View,
  Text,
  Button,
  ButtonSpinner,
  ButtonText,
} from "@gluestack-ui/themed";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "@/lang";

type Props = {
  buttonLabel?: string;

  isLoading?: boolean;
  isDisabled?: boolean;

  hint?: string;

  onPress?: () => void;
};

const BottomSection = ({
  buttonLabel,

  isLoading = false,
  isDisabled = false,

  hint,

  onPress,
}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      backgroundColor="transparent"
      maxWidth={500}
      paddingBottom={insets.bottom === 0 ? "$4" : insets.bottom}
      justifyContent="flex-end"
      alignItems="center"
      gap="$4"
      width="100%"
      flex={1}
    >
      {hint && (
        <Text fontSize="$sm" lineHeight="$sm" fontWeight="$normal">
          {hint}
        </Text>
      )}
      <Button
        action={"primary"}
        variant={"solid"}
        size={"xl"}
        isDisabled={isDisabled}
        width={"100%"}
        onPress={onPress}
        rounded="$full"
      >
        {isLoading ? (
          <ButtonSpinner size="small" />
        ) : (
          <ButtonText fontFamily="Inter_600SemiBold" letterSpacing="$lg">
            {buttonLabel ? buttonLabel : i18n.t("continue")}
          </ButtonText>
        )}
      </Button>
    </View>
  );
};

export default BottomSection;
