import { View, useColorMode, Icon, CheckIcon } from "@gluestack-ui/themed";
import React from "react";
import verifiedBadgeStyles from "./verified_badge.styles";

type Props = {
  size: number;
};

const VerifiedBadge = (props: Props) => {
  const colorMode = useColorMode();

  return (
    <View
      style={[
        verifiedBadgeStyles.viewContainer,
        { width: props.size, height: props.size, borderRadius: props.size / 2 },
      ]}
      bgColor={colorMode === "dark" ? "$primary400" : "$primary700"}
    >
      <Icon
        as={CheckIcon}
        width={props.size * 0.6}
        height={props.size * 0.6}
        color="white"
      />
    </View>
  );
};

export default VerifiedBadge;
