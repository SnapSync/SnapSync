import React from "react";
import { IUserProfileZodiacSign } from "@/interfaces/users.interface";
import { View, useColorMode, Text } from "@gluestack-ui/themed";
import { Skeleton } from "moti/skeleton";
import i18n from "@/lang";

type Props = {
  isLoading?: boolean;
  zodiacSign?: IUserProfileZodiacSign;
  snapSyncScore?: number;
  streak?: number;
};

const Infos = ({
  isLoading = false,
  zodiacSign,
  snapSyncScore,
  streak,
}: Props) => {
  const colorMode = useColorMode();

  return (
    <View
      backgroundColor="transparent"
      paddingVertical="$2.5"
      gap="$4"
      flexDirection="row"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      {isLoading ? (
        new Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              show={isLoading}
              colorMode={colorMode as "dark" | "light"}
              width={80}
              height={40}
              key={index}
            />
          ))
      ) : (
        <>
          {snapSyncScore && snapSyncScore > 0 ? (
            <View
              backgroundColor="transparent"
              alignItems="center"
              justifyContent="center"
              gap="$1"
              borderRadius="$xl"
              borderColor={
                colorMode === "dark" ? "$borderDark400" : "$borderLight700"
              }
              borderWidth={1}
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              minWidth={80}
            >
              <Text fontFamily="Inter_600SemiBold" fontSize="$sm">
                {snapSyncScore}
              </Text>
            </View>
          ) : null}
          {zodiacSign ? (
            <View
              backgroundColor="transparent"
              alignItems="center"
              justifyContent="center"
              gap="$1"
              borderRadius="$xl"
              borderColor={
                colorMode === "dark" ? "$borderDark400" : "$borderLight700"
              }
              borderWidth={1}
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              minWidth={80}
            >
              {zodiacSign ? (
                <Text fontFamily="Inter_600SemiBold" fontSize="$sm">
                  {zodiacSign.symbol}{" "}
                  {i18n.t(`zodiacSigns.${zodiacSign.name.toLowerCase()}`)}
                </Text>
              ) : null}
            </View>
          ) : null}
          {streak && streak > 0 ? (
            <View
              backgroundColor="transparent"
              alignItems="center"
              justifyContent="center"
              gap="$1"
              borderRadius="$xl"
              borderColor={
                colorMode === "dark" ? "$borderDark400" : "$borderLight700"
              }
              borderWidth={1}
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              minWidth={80}
            >
              <Text fontFamily="Inter_600SemiBold" fontSize="$sm">
                🔥{streak}
              </Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

export default Infos;
