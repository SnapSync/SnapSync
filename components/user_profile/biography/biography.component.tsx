import { Text, useColorMode, View } from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import React from "react";

type Props = {
  biography?: string | null;
  isLoading?: boolean;
};

const Biography = ({ biography, isLoading = false }: Props) => {
  const colorMode = useColorMode();
  if (isLoading) {
    return (
      <View gap={16} backgroundColor="transparent">
        {new Array(3).fill(0).map((_, index) => (
          <Skeleton
            height={14}
            width="100%"
            key={index}
            colorMode={colorMode === "dark" ? "dark" : "light"}
          />
        ))}
      </View>
    );
  }

  if (biography && biography.length > 0) {
    return (
      <Text
        size="md"
        fontFamily="Inter_400Regular"
        // color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
      >
        {biography}
      </Text>
    );
  }

  return null;
};

export default Biography;
