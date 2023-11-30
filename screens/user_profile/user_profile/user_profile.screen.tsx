import React, { useCallback } from "react";
import { UserProfileStackScreenProps } from "@/types";
import {
  View,
  useColorMode,
  Text,
  SlashIcon,
  ShareIcon,
} from "@gluestack-ui/themed";
import { Alert, Animated } from "react-native";
import { SCREEN_WIDTH } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchUserProfileById } from "@/api/routes/users.route";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useAnimateScrollView } from "@/hooks/useAnimatedScrollView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBackdrop from "@/components/custom_backdrop/custom_backdrop.component";
import { Layout } from "@/costants/Layout";
import {
  LogOutIcon,
  PencilIcon,
  TriangleIcon,
  UserCog2Icon,
  UserMinus2Icon,
} from "lucide-react-native";
import {
  SendFriendRequest,
  ShowFriendship,
} from "@/api/routes/friendships.route";
import i18n from "@/lang";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import { logout } from "@/redux/features/auth/authSlice";
import { IFriendshipStatus } from "@/interfaces/friendship_status.interface";
import Biography from "@/components/user_profile/biography/biography.component";
import userProfileKeys from "./queries";
import BottomSheetItem from "@/components/bottom_sheet_item/bottom_sheet_item.component";
import FixedNavBar from "@/components/user_profile/fixed_navbar/fixed_navbar.component";
import Header from "@/components/user_profile/header/header.component";
import AnimatedHeader from "@/components/user_profile/animated_header/animated_header.component";
import { instanceOfErrorResponseType } from "@/api";
import userProfileStyles from "./user_profile.styles";
import FriendshipStatus from "@/components/user_profile/friendship_status/friendship_status.component";

const UserProfileScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"UserProfile">) => {
  const { dismissAll } = useBottomSheetModal();
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();

  const [scroll, onScroll, scale, translateYDown, translateYUp, opacity] =
    useAnimateScrollView(SCREEN_WIDTH, false);

  const queryClient = useQueryClient();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const dispatch = useDispatch();

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(() => ["25%", "50%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={() => dismissAll()}
      />
    ),
    []
  );

  const {
    data: userProfileData,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
    error: errorUserProfile,
    isRefetching: isRefetchingUserProfile,
  } = useQuery({
    queryKey: userProfileKeys.userProfile(route.params.id),
    queryFn: () => FetchUserProfileById(route.params.id, tokenApi),
    enabled: isLoggedIn && route.params && route.params.id ? true : false,
    staleTime: Infinity,
    gcTime: Infinity,
    // refetchOnReconnect: true,
  });

  const {
    data: friendshipStatusData,
    isLoading: isLoadingFriendshipStatus,
    isRefetching: isRefetchingFriendshipStatus,
  } = useQuery({
    queryKey: userProfileKeys.friendshipStatus(route.params.id),
    queryFn: () => ShowFriendship(route.params.id, tokenApi),
    enabled:
      isLoggedIn &&
      route.params &&
      route.params.id &&
      route.params.id !== userId
        ? true
        : false,
    staleTime: Infinity,
    gcTime: Infinity,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
  });

  const sendFriendshipRequestMutation = useMutation({
    mutationKey: userProfileKeys.sendFriendhipRequests(route.params?.id),
    mutationFn: (data: { userId: number }) =>
      SendFriendRequest(data.userId, tokenApi),
    onMutate: async (data: { userId: number }) => {
      // queryClient.cancelQueries lo uso per evitare che venga eseguita la query
      // mentre sto facendo la mutazione, in questo modo evito che venga eseguita
      // due volte la query
      // await queryClient.cancelQueries({
      //   queryKey: userProfileKeys.friendshipStatus(data.userId),
      // });
      // queryClient.setQueryData<IFriendshipStatus>(
      //   userProfileKeys.friendshipStatus(data.userId),
      //   (old) =>
      //     ({
      //       ...old,
      //       outgoingRequest: true,
      //       isNotSynced: true,
      //     } as IFriendshipStatus)
      // );
    },
    onError(error, variables, context) {},
    onSuccess(data, variables, context) {
      // In case di successo aggiorno isNotSynced
      queryClient.setQueryData<IFriendshipStatus>(
        userProfileKeys.friendshipStatus(variables.userId),
        {
          ...data,
          isNotSynced: false,
        }
      );
    },
  });

  const [isMyProfile, setIsMyProfile] = React.useState<boolean>(
    userId === route.params.id
  );

  React.useEffect(() => {
    return () => dismissAll();
  }, []);

  React.useEffect(() => {
    if (friendshipStatusData && friendshipStatusData.isBlocking) goBack();
  }, [friendshipStatusData]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const goBack = () => {
    if (isMyProfile || !navigation.canGoBack())
      navigation.navigate("MainStack", { screen: "Home" });
    else navigation.goBack();
  };

  const goToEditProfile = () => {
    dismissAll();
  };

  const goToUserSettings = () => {
    dismissAll();
  };

  const handleLogout = async () => {
    dismissAll();

    // Elimito il token dallo storage
    await SecureStore.deleteItemAsync(AuthTokenKey);

    // Elimino lo UserId dallo storage
    await SecureStore.deleteItemAsync(UserIdKey);

    // Pulisco tutti le query
    await queryClient.clear();

    // Navigo verso la schermata di login
    dispatch(logout());
  };

  const accept = (userId: number) => {};

  const reject = (userId: number) => {};

  const send = (userId: number) => {
    sendFriendshipRequestMutation.mutate({ userId });
  };

  const cancel = (userId: number) => {};

  const destroy = (userId: number) => {
    Alert.alert(
      i18n.t("unfriendTitle", {
        username: userProfileData?.username,
      }),
      i18n.t("unfriendConfirmation", {
        username: userProfileData?.username,
      }),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => {
            dismissAll();
          },
        },
      ]
    );
  };

  const block = (userId: number) => {
    Alert.alert(
      i18n.t("blockUser", {
        username: userProfileData?.username,
      }),
      i18n.t("blockUserConfirmation", {
        username: userProfileData?.username,
      }),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("block"),
          style: "destructive",
          onPress: () => {
            dismissAll();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FixedNavBar
        username={
          userProfileData ? userProfileData.username : route.params.username
        }
        isVerified={
          userProfileData ? userProfileData.isVerified : route.params.isVerified
        }
        containerStyle={{
          paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: insets.right + Layout.DefaultMarginHorizontal,
          paddingTop: insets.top,
        }}
        userHasImage={
          (route.params && route.params.profilePictureUrl) ||
          (userProfileData && userProfileData.profilePicture)
            ? true
            : false
        }
        onPressLeftIcon={goBack}
        onPressRightIcon={handlePresentModalPress}
        withDarkMode={colorMode === "dark" ? true : false}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsVerticalScrollIndicator={true}
      >
        {(route.params && route.params.profilePictureUrl) ||
        (userProfileData && userProfileData.profilePicture) ? (
          <AnimatedHeader
            scale={scale}
            translateYUp={translateYUp}
            translateYDown={translateYDown}
            opacity={opacity}
            imageSize={SCREEN_WIDTH}
            avatarUrl={
              userProfileData && userProfileData.profilePicture
                ? userProfileData.profilePicture.url
                : route.params.profilePictureUrl
            }
            fullname={
              userProfileData
                ? userProfileData.fullname
                : route.params?.fullname
            }
            streak={
              userProfileData ? userProfileData.streak : route.params?.streak
            }
            footerContainerStyle={{
              paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
              paddingRight: insets.right + Layout.DefaultMarginHorizontal,
            }}
          />
        ) : (
          <Header
            containerStyle={{
              paddingTop: 56 + insets.top, // Altezza della navbar + padding top
              paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
              paddingRight: insets.right + Layout.DefaultMarginHorizontal,
            }}
            username={
              userProfileData ? userProfileData.username : route.params.username
            }
            fullname={
              userProfileData
                ? userProfileData.fullname
                : route.params?.fullname
            }
            withDarkMode={colorMode === "dark" ? true : false}
            isLoading={isLoadingUserProfile}
            streak={
              userProfileData ? userProfileData.streak : route.params?.streak
            }
          />
        )}

        {!route.params.id || isErrorUserProfile ? (
          <View
            style={[
              {
                paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                paddingRight: insets.right + Layout.DefaultMarginHorizontal,
              },
              userProfileStyles.content,
            ]}
          >
            <Text
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
              fontFamily="Inter-Bold"
            >
              {!route.params ||
              !route.params.id ||
              (errorUserProfile &&
                instanceOfErrorResponseType(errorUserProfile) &&
                errorUserProfile.statusCode === 404)
                ? i18n.t("errors.userNotFound")
                : i18n.t("errors.generic")}
            </Text>
          </View>
        ) : (
          <View
            style={[
              {
                paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                paddingRight: insets.right + Layout.DefaultMarginHorizontal,
              },
              userProfileStyles.content,
            ]}
          >
            {isMyProfile ||
            (friendshipStatusData && friendshipStatusData.isFriend) ? (
              // Per mostrare la biografia devo essere loggato e o essere il mio profilo o essere amici
              <Biography
                biography={
                  userProfileData
                    ? userProfileData.biography
                    : route.params?.biography
                }
                isLoading={isLoadingUserProfile}
                withDarkMode={colorMode === "dark" ? true : false}
              />
            ) : (
              <FriendshipStatus
                username={
                  userProfileData
                    ? userProfileData.username
                    : route.params?.username
                }
                isLoading={isLoadingFriendshipStatus}
                friendshipStatus={friendshipStatusData}
                variant={route.params?.friendshipStatusLoaderVariant}
                withDarkMode={colorMode === "dark" ? true : false}
              />
            )}
          </View>
        )}
      </Animated.ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: colorMode === "dark" ? "#171717" : "#FCFCFC",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorMode === "dark" ? "#FCFCFC" : "#171717",
        }}
        backdropComponent={renderBackdrop}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          {isMyProfile ? (
            <>
              <BottomSheetItem
                iconAs={PencilIcon}
                label={i18n.t("profile.bottomSheetModal.editProfile")}
                containerStyle={{
                  paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                  paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                }}
                withDarkMode={colorMode === "dark" ? true : false}
                withDivider
                onPress={goToEditProfile}
              />
              <BottomSheetItem
                iconAs={UserCog2Icon}
                label={i18n.t("profile.bottomSheetModal.settings")}
                containerStyle={{
                  paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                  paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                }}
                withDarkMode={colorMode === "dark" ? true : false}
                withDivider
                onPress={goToUserSettings}
              />
              <BottomSheetItem
                iconAs={LogOutIcon}
                label={i18n.t("profile.bottomSheetModal.logout")}
                containerStyle={{
                  paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                  paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                }}
                withDarkMode={colorMode === "dark" ? true : false}
                variant="danger"
                onPress={handleLogout}
              />
            </>
          ) : userProfileData ? (
            <>
              <BottomSheetItem
                iconAs={ShareIcon}
                label={i18n.t("profile.bottomSheetModal.share", {
                  username: userProfileData.username,
                })}
                containerStyle={{
                  paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                  paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                }}
                withDarkMode={colorMode === "dark" ? true : false}
                withDivider
              />
              {!friendshipStatusData?.isBlocking && (
                <BottomSheetItem
                  iconAs={SlashIcon}
                  label={i18n.t("profile.bottomSheetModal.block", {
                    username: userProfileData.username,
                  })}
                  containerStyle={{
                    paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                    paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                  }}
                  withDarkMode={colorMode === "dark" ? true : false}
                  withDivider
                  variant="danger"
                  onPress={() => block(userProfileData.id)}
                />
              )}
              {friendshipStatusData?.isFriend && (
                <BottomSheetItem
                  iconAs={UserMinus2Icon}
                  label={i18n.t("profile.bottomSheetModal.unfriend")}
                  containerStyle={{
                    paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                    paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                  }}
                  withDarkMode={colorMode === "dark" ? true : false}
                  withDivider
                  variant="danger"
                  onPress={() => destroy(userProfileData.id)}
                />
              )}
              <BottomSheetItem
                iconAs={TriangleIcon}
                label={i18n.t("profile.bottomSheetModal.report", {
                  username: userProfileData.username,
                })}
                containerStyle={{
                  paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
                  paddingRight: insets.right + Layout.DefaultMarginHorizontal,
                }}
                withDarkMode={colorMode === "dark" ? true : false}
                variant="danger"
              />
            </>
          ) : null}
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default UserProfileScreen;
