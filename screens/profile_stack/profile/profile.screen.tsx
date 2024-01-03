import { TouchableOpacity } from "react-native";
import React from "react";
import { ProfileStackScreenProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, ScrollView, View, useColorMode } from "@gluestack-ui/themed";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useMe } from "@/api/queries/useMe";
import { UserCog2Icon } from "lucide-react-native";
import { Layout } from "@/costants/Layout";
import UserProfileHeader from "@/components/user_profile_header/user_profile_header.component";
import UserProfileCounters from "@/components/user_profile_counters/user_profile_counters.componenent";
import { useFriendsCount } from "@/api/queries/useFriendsCount";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import UserProfileBiography from "@/components/user_profile_biography/user_profile_biography.component";

type Props = ProfileStackScreenProps<"Profile">;

const ProfileScreen = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const { data, isLoading } = useMe(isLoggedIn, tokenApi);

  const { data: friendsCount, refetch } = useFriendsCount(isLoggedIn, tokenApi);
  useRefreshOnFocus(refetch); // Ogni volta che torno in questa schermata, refetcho i dati

  React.useEffect(() => {
    if (data) {
      navigation.setParams({
        username: data.username,
        isVerified: data.isVerified,
      });
    }

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={goToUserSettings}>
          <Icon
            as={UserCog2Icon}
            size="xl"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          />
        </TouchableOpacity>
      ),
    });
  }, [data, navigation]);

  const goToUserSettings = () => {
    navigation.navigate("UserSettingsStack", {
      screen: "Settings",
      params: {
        ...data,
      },
    });
  };

  const goToFriendsList = () => {
    navigation.navigate("FriendsList");
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
          // alignItems: "center",
          gap: 16,
        }}
        backgroundColor="transparent"
        showsVerticalScrollIndicator={false}
      >
        <UserProfileHeader
          isLoading={isLoading}
          fullname={data?.fullname}
          username={data?.username}
          profilePicture={data?.profilePicture}
          isVerified={data?.isVerified}
        />
        <UserProfileCounters
          friends={friendsCount?.count || 0}
          streak={10}
          // onPressFriendsCount={goToFriendsList}
        />

        <UserProfileBiography
          isLoading={isLoading}
          biography={data?.biography}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
