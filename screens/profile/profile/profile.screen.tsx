import { RootState } from "@/redux/app/store";
import {
  View,
  Text,
  useColorMode,
  Icon,
  ScrollView,
  Avatar,
  AvatarImage,
  AvatarBadge,
  AvatarFallbackText,
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
import { UserCog2Icon, Verified } from "lucide-react-native";

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
        isVerified: data.isVerified,
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
    <View flex={1} backgroundColor="transparent">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 20,
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
          alignItems: "center",
        }}
        gap="$4"
        backgroundColor="transparent"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Skeleton
          width={96}
          height={96}
          radius="round"
          show={isLoading}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Avatar size="xl">
            <AvatarFallbackText>
              {data?.username ?? data?.username}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: data?.profilePicture?.url,
              }}
            />
            {!isLoading && data && data.isVerified ? (
              <AvatarBadge
                bgColor={
                  colorMode === "dark"
                    ? "$backgroundDark950"
                    : "$backgroundLight0"
                }
                alignItems="center"
                justifyContent="center"
                borderWidth={0}
              >
                <Icon
                  as={Verified}
                  size="sm"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
              </AvatarBadge>
            ) : null}
          </Avatar>
        </Skeleton>
        <Skeleton
          show={isLoading}
          height={41}
          width={200}
          colorMode={colorMode === "dark" ? "dark" : "light"}
        >
          <Text fontFamily="Inter_800ExtraBold" size="3xl">
            {data?.fullname}
          </Text>
        </Skeleton>

        <Biography biography={data?.biography} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
