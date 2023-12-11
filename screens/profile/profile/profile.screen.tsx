import { RootState } from "@/redux/app/store";
import {
  View,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Text,
  useColorMode,
  Icon,
} from "@gluestack-ui/themed";
import React from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "moti/skeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { ProfileStackScreenProps } from "@/types";
import { useMeQuery } from "@/queries/useMeQuery";
import Biography from "@/components/user_profile/biography/biography.component";
import { TouchableOpacity } from "react-native";
import { UserCog2Icon } from "lucide-react-native";

const ProfileScreen = ({ navigation }: ProfileStackScreenProps<"Profile">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const { data, isLoading } = useMeQuery(tokenApi, isLoggedIn);

  React.useEffect(() => {
    if (data) {
      navigation.setParams({
        username: data.username,
      });
    }

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserSettingsStack", {
              screen: "Settings",
              params: {
                ...data,
              },
            })
          }
        >
          <Icon
            as={UserCog2Icon}
            size="xl"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          />
        </TouchableOpacity>
      ),
    });
  }, [data, navigation]);

  return (
    <View
      flex={1}
      backgroundColor="transparent"
      paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
      paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
      paddingBottom={insets.bottom}
      paddingTop={insets.top}
    >
      <View backgroundColor="transparent" gap={16} alignItems="center">
        <Skeleton
          width={96}
          height={96}
          radius="round"
          show={isLoading}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Avatar borderRadius="$full" size="xl">
            <AvatarFallbackText fontFamily="Inter-Bold">
              {data?.username || data?.fullname}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: data?.profilePicture?.url,
              }}
            />
          </Avatar>
        </Skeleton>

        {isLoading ? (
          <Skeleton
            width="100%"
            height={20}
            colorMode={colorMode === "dark" ? "dark" : "light"}
          />
        ) : (
          <Text fontFamily="Inter-ExtraBold" fontSize="$3xl" lineHeight="$3xl">
            {data?.fullname}
          </Text>
        )}

        <Biography biography={data?.biography} isLoading={isLoading} />
      </View>
    </View>
  );
};

export default ProfileScreen;
