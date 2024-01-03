import { useColorMode, Text } from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import React from "react";

type Props = {
  isLoading?: boolean;
  fullname?: string;
};

const UserProfileHeaderFullName = ({ isLoading, fullname }: Props) => {
  const colorMode = useColorMode();
  return (
    <Skeleton
      show={isLoading}
      height={41}
      width={200}
      colorMode={colorMode === "dark" ? "dark" : "light"}
    >
      <Text fontFamily="Inter_800ExtraBold" size="3xl" textAlign="center">
        {fullname}
      </Text>
    </Skeleton>
  );
};

export default UserProfileHeaderFullName;
