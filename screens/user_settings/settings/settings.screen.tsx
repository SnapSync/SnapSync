import SettingItem from "@/components/settings/setting_item/setting_item.component";
import SettingSectionHeader from "@/components/settings/setting_section_header/setting_section_header.component";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";
import {
  Divider,
  InfoIcon,
  LockIcon,
  View,
  useColorMode,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Pressable,
  Spinner,
  ScrollView,
  HelpCircleIcon,
  StarIcon,
} from "@gluestack-ui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CogIcon, LogOutIcon } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { logout } from "@/redux/features/auth/authSlice";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import { UserSettingsStackScreenProps } from "@/types";
import { RootState } from "@/redux/app/store";
import SettingsKeys from "./settings.keys";
import {
  FetchWebInfo,
  IResponseWebInfo,
  UpdateAllowSyncContacts,
} from "@/api/routes/settings.route";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import * as StoreReview from "expo-store-review";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { useMe } from "@/api/queries/useMe";

const DefaultView = ({
  colorMode,
  children,
}: {
  colorMode: string;
  children: React.ReactNode;
}) => (
  <View
    gap="$5"
    borderRadius="$xl"
    paddingHorizontal="$3"
    paddingVertical="$5"
    bgColor={colorMode === "dark" ? "$backgroundDark900" : "$backgroundLight50"}
    marginBottom="$10"
    borderColor={colorMode === "dark" ? "$borderDark400" : "$borderLight400"}
    borderWidth="$1"
  >
    {children}
  </View>
);

const SettingsScreen = ({
  navigation,
  route,
}: UserSettingsStackScreenProps<"Settings">) => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const updateAllowSyncContactsMutation = useMutation({
    mutationFn: (data: { allowSyncContacts: boolean }) =>
      UpdateAllowSyncContacts(data.allowSyncContacts, tokenApi),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: SettingsKeys.webInfo,
      });

      queryClient.setQueryData<IResponseWebInfo>(
        SettingsKeys.webInfo,
        (old) => {
          if (old) {
            return {
              ...old,
              webInfo: {
                ...old.webInfo,
                allowSyncContacts: data.allowSyncContacts,
                isNotSynced: true,
              },
            };
          }
        }
      );
    },
    onError: (error, variables, context) => {
      // Ripristino il valore precedente
      queryClient.setQueryData<IResponseWebInfo>(
        SettingsKeys.webInfo,
        (old) => {
          if (old) {
            return {
              ...old,
              webInfo: {
                ...old.webInfo,
                allowSyncContacts: !variables.allowSyncContacts,
                isNotSynced: false,
              },
            };
          }
        }
      );
    },
    onSuccess: async (data) => {
      // Aggiorno il valore del webInfo
      await queryClient.setQueryData<IResponseWebInfo>(
        SettingsKeys.webInfo,
        (old) => {
          if (old) {
            return {
              ...old,
              webInfo: {
                ...data.webInfo,
                isNotSynced: false,
              },
            };
          }
        }
      );
    },
  });

  const { data } = useMe(isLoggedIn, tokenApi);

  // const {
  //   data: webInfo,
  //   isLoading,
  //   refetch,
  // } = useQuery({
  //   queryKey: SettingsKeys.webInfo,
  //   queryFn: () => FetchWebInfo(tokenApi),
  //   enabled: isLoggedIn,
  //   staleTime: 1000 * 60 * 60, // 1 ora, poichè il webInfo non cambia molto spesso, e se cambia, viene aggiornato con il mutation
  //   gcTime: Infinity,
  // });
  // useRefreshOnFocus(refetch);

  const [isLoadingLogout, setIsLoadingLogout] = React.useState(false);

  React.useEffect(() => {
    if (isLoadingLogout) _logout();
  }, [isLoadingLogout]);

  const _logout = async () => {
    // Elimito il token dallo storage
    await SecureStore.deleteItemAsync(AuthTokenKey);

    // Elimino lo UserId dallo storage
    await SecureStore.deleteItemAsync(UserIdKey);

    // Pulisco tutti le query
    clearCache();

    // Navigo verso la schermata di login
    dispatch(logout());
  };

  const clearCache = () => queryClient.clear();

  const goToEditProfile = () => navigation.navigate("EditProfile");

  const onToggleAllowSyncContacts = (value: boolean) => {
    updateAllowSyncContactsMutation.mutate({ allowSyncContacts: value });
  };

  const rateApp = async () => {
    // https://docs.expo.dev/versions/latest/sdk/storereview/#storereviewstoreurl

    if (Platform.OS === "android") {
      // Open the Android Play Store directly
      //Linking.openURL(`market://details?id=${androidPackageName}&showAllReviews=true`);
    } else if (Platform.OS === "ios") {
      // Open the iOS App Store directly
      // Linking.openURL(
      //   `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
      // );
    }
  };

  if (isLoadingLogout) {
    return (
      <View
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="rgba(0,0,0,0.5)"
      >
        <Spinner size="small" />
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="transparent">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
          paddingTop: 20,
        }}
        backgroundColor="transparent"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          onPress={goToEditProfile}
          gap="$2"
          borderRadius="$xl"
          paddingHorizontal="$3"
          paddingVertical="$5"
          bgColor={
            colorMode === "dark" ? "$backgroundDark900" : "$backgroundLight50"
          }
          marginBottom="$10"
          flexDirection="row"
          alignItems="center"
          borderColor={
            colorMode === "dark" ? "$borderDark400" : "$borderLight400"
          }
          borderWidth="$1"
        >
          <Avatar>
            <AvatarFallbackText>
              {data
                ? data.username
                  ? data.username
                  : data.fullname
                : route.params?.username
                ? route.params?.username
                : route.params?.fullname}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: data
                  ? data.profilePicture?.url
                  : route.params?.profilePicture?.url,
              }}
            />
          </Avatar>
          <Divider orientation="vertical" />
          <View
            flex={1}
            gap="$2"
            flexDirection="column"
            backgroundColor="transparent"
          >
            <Text
              isTruncated
              flexShrink={1}
              fontFamily="Inter_600SemiBold"
              size="md"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            >
              {data ? data.username : route.params?.username}
            </Text>
            <Text
              isTruncated
              flexShrink={1}
              size="sm"
              fontFamily="Inter_400Regular"
            >
              {data ? data.fullname : route.params?.fullname}
            </Text>
          </View>
        </Pressable>

        <SettingSectionHeader
          iconAs={CogIcon}
          sectionName={i18n.t("userSettingsScreen.settings.title")}
        />
        <DefaultView colorMode={colorMode}>
          <SettingItem
            label={i18n.t(
              "userSettingsScreen.settings.items.notificationTitle"
            )}
            // onPress={() => navigation.navigate("Account")}
          />
          <Divider />
          <SettingItem
            label={i18n.t("userSettingsScreen.settings.items.otherTitle")}
            onPress={() => navigation.navigate("Other")}
          />
        </DefaultView>

        <SettingSectionHeader
          iconAs={LockIcon}
          sectionName={i18n.t("userSettingsScreen.privacy.title")}
        />
        <DefaultView colorMode={colorMode}>
          {/* <SettingItem
            label={i18n.t("userSettings.privacy.items.syncContactsTitle")}
            showSwitch
            valueSwitch={webInfo?.webInfo.allowSyncContacts ?? false}
            onToggleSwitch={onToggleAllowSyncContacts}
            isDisabledSwitch={
              updateAllowSyncContactsMutation.isPending || isLoading
            }
          />
          <Divider /> */}
          <SettingItem
            label={i18n.t("userSettingsScreen.privacy.items.blockedUsersTitle")}
            onPress={() => navigation.navigate("BlockedUsers")}
          />
        </DefaultView>

        <SettingSectionHeader
          iconAs={InfoIcon}
          sectionName={i18n.t("userSettingsScreen.more.title")}
        />
        <DefaultView colorMode={colorMode}>
          <SettingItem
            label={i18n.t("userSettingsScreen.more.items.aboutTitle")}
            iconAs={HelpCircleIcon}
          />
          <Divider />
          <SettingItem
            label={i18n.t("userSettingsScreen.more.items.rateThisAppTitle")}
            iconAs={StarIcon}
            onPress={rateApp}
          />
          <Divider />
          <SettingItem
            label={i18n.t("userSettingsScreen.more.items.logoutTitle")}
            variant="danger"
            iconAs={LogOutIcon}
            onPress={() => setIsLoadingLogout(true)}
          />
        </DefaultView>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
