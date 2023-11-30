import {
  View,
  Text,
  Button,
  ButtonSpinner,
  ButtonText,
} from "@gluestack-ui/themed";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import bottomSectionStyles from "./bottom_section.styles";

type Props = {
  buttonLabel: string;

  isLoading?: boolean;
  isDisabled?: boolean;

  pb?: number;

  hint?: string;

  onPress?: () => void;
};

const BottomSection = ({
  buttonLabel,

  isLoading = false,
  isDisabled = false,

  pb,

  hint,

  onPress,
}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        bottomSectionStyles.container,
        {
          paddingBottom: pb ?? insets.bottom,
        },
      ]}
    >
      {hint && <Text style={bottomSectionStyles.hint}>{hint}</Text>}
      <Button
        action={"primary"}
        variant={"solid"}
        size={"lg"}
        isDisabled={isDisabled}
        width={"100%"}
        onPress={onPress}
        rounded="$full"
      >
        {isLoading ? (
          <ButtonSpinner size="small" />
        ) : (
          <ButtonText fontFamily="Inter-SemiBold">{buttonLabel}</ButtonText>
        )}
      </Button>
    </View>
  );
};

export default BottomSection;
