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
import Infos from "@/components/user_profile/infos/infos.component";
import { useQuery } from "@tanstack/react-query";
import ProfileKeys from "./profile.keys";
import { FetchUserFriendsCount } from "@/api/routes/friendships.route";
import Counters from "@/components/profile/counters/counters.componenent";

const ProfileScreen = ({ navigation }: ProfileStackScreenProps<"Profile">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const { data, isLoading } = useMeQuery(tokenApi, isLoggedIn);

  const { data: friendsCountData, isLoading: isLoadingFriendsCount } = useQuery(
    {
      queryKey: ProfileKeys.friendsCount,
      queryFn: () => FetchUserFriendsCount(tokenApi),
      enabled: isLoggedIn,
      staleTime: 1000 * 60 * 5, // 5 minuti -> dopo il dato viene considerato vecchio, perciò viene rifetchato quando si entra nella schermata
      gcTime: Infinity,
    }
  );

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

  const goToFriendsList = () => {
    navigation.navigate("FriendsList", {
      total: friendsCountData?.count,
    });
  };

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
          gap: 16,
        }}
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
          <Text fontFamily="Inter_800ExtraBold" size="3xl" textAlign="center">
            {data?.fullname}
          </Text>
        </Skeleton>

        <Biography biography={data?.biography} isLoading={isLoading} />

        <Infos isLoading={isLoading} zodiacSign={data?.zodiacSign} />

        <Counters
          friendsCount={friendsCountData?.count}
          isLoadingFriendsCount={isLoadingFriendsCount}
          isLoadingSnapsCount={false}
          onPressFriendsCount={goToFriendsList}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
