import { FetchMe } from "@/api/routes/users.route";
import { RootState } from "@/redux/app/store";
import HomeKeys from "@/screens/main/home/home.keys";
import {
  View,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Text,
  useColorMode,
} from "@gluestack-ui/themed";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import { logout } from "@/redux/features/auth/authSlice";
import { Skeleton } from "moti/skeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { MainStackScreenProps, ProfileStackScreenProps } from "@/types";
import { useMeQuery } from "@/queries/useMeQuery";

const ProfileScreen = ({ navigation }: ProfileStackScreenProps<"Profile">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { data, isLoading } = useMeQuery(tokenApi, isLoggedIn);

  React.useEffect(() => {
    if (data) {
      navigation.setParams({
        username: data.username,
      });
    }
  }, [data, navigation]);

  const _onPress = async () => {
    // Elimito il token dallo storage
    await SecureStore.deleteItemAsync(AuthTokenKey);

    // Elimino lo UserId dallo storage
    await SecureStore.deleteItemAsync(UserIdKey);

    // Pulisco tutti le query
    await queryClient.clear();

    // Navigo verso la schermata di login
    dispatch(logout());
  };

  return (
    <View
      flex={1}
      backgroundColor="transparent"
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
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
          <Skeleton width="100%" height={20} />
        ) : (
          <Text fontFamily="Inter-ExtraBold" fontSize="$3xl" lineHeight="$3xl">
            {data?.fullname}
          </Text>
        )}

        {isLoading ? (
          <View width="100%" gap={4}>
            {new Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} width="100%" height={14} />
            ))}
          </View>
        ) : (
          <Text
            fontFamily="Inter-Regular"
            fontSize="$md"
            lineHeight="$md"
            color={colorMode === "dark" ? "$textDark400" : "$textLight700"}
          >
            {data?.biography}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;
