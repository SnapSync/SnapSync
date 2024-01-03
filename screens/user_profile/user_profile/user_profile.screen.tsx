import React, { useCallback } from "react";
import { UserProfileStackScreenProps } from "@/types";
import {
  View,
  useColorMode,
  Text,
  SlashIcon,
  ShareIcon,
  Icon,
  ThreeDotsIcon,
} from "@gluestack-ui/themed";
import { Alert, Animated, TouchableOpacity } from "react-native";
import { SCREEN_WIDTH } from "@/utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchUserProfileById } from "@/api/routes/users.route";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useAnimateScrollView } from "@/hooks/useAnimatedScrollView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBackdrop from "@/components/custom_backdrop/custom_backdrop.component";
import { Layout } from "@/costants/Layout";
import {
  ChevronLeftIcon,
  TriangleIcon,
  UserMinus2Icon,
} from "lucide-react-native";
import { BlockUser } from "@/api/routes/friendships.route";
import i18n from "@/lang";
import UserProfileKeys from "./user_profile.keys";
import BottomSheetItem from "@/components/bottom_sheet_item/bottom_sheet_item.component";
import Header from "@/components/user_profile/header/header.component";
import AnimatedHeader from "@/components/user_profile/animated_header/animated_header.component";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import Biography from "@/components/user_profile/biography/biography.component";
import FriendshipStatus from "@/components/user_profile/friendship_status/friendship_status.component";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { StatusBar } from "expo-status-bar";
import SocialContext from "@/components/user_profile/social_context/social_context.component";

import { useFriendshipStatus } from "@/api/queries/useFriendshipStatus";
import { useInfiniteMutualFriends } from "@/api/queries/useInfiniteMutualFriends";
import { useDenyFriendship } from "@/api/mutations/useDenyFriendship";
import { useAcceptFriendship } from "@/api/mutations/useAcceptFriendship";
import { useCreateFriendship } from "@/api/mutations/useCreateFriendship";
import { useDestroyFriendship } from "@/api/mutations/useDestroyFriendship";
import { isErrorResponse } from "@/api/api_responses.types";

const UserProfileScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"UserProfile">) => {
  const { dismissAll } = useBottomSheetModal();
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const [scroll, onScroll, scale, translateYDown, translateYUp, opacity] =
    useAnimateScrollView(SCREEN_WIDTH, false);

  const queryClient = useQueryClient();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  // const userId = useSelector((state: RootState) => state.auth.userId);

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
    refetch: refetchUserProfile,
  } = useQuery({
    queryKey: UserProfileKeys.userProfile(route.params.id),
    queryFn: () => FetchUserProfileById(route.params.id, tokenApi),
    enabled: isLoggedIn && route.params && route.params.id ? true : false,
    staleTime: 1000 * 60 * 60, // 1 ora
    gcTime: Infinity,
  });

  useRefreshOnFocus(refetchUserProfile);

  const {
    data: friendshipStatusData,
    isLoading: isLoadingFriendshipStatus,
    refetch: refetchFriendshipStatus,
  } = useFriendshipStatus(route.params.id, isLoggedIn, tokenApi);

  useRefreshOnFocus(refetchFriendshipStatus);

  // Nel caso fosse il profilo di un'altro utente allora carico gli amici in comune con l'utente
  const { data: mutualFriendsData, isLoading: isLoadingMutualFriends } =
    useInfiniteMutualFriends(route.params.id, isLoggedIn, tokenApi);

  // const blockUserMutation = useMutation({
  //   mutationFn: (data: { userId: number }) => BlockUser(data.userId, tokenApi),
  //   onSuccess(data, variables, context) {
  //     // In case di successo aggiorno isNotSynced
  //     queryClient.setQueryData<IFriendshipStatus>(
  //       UserProfileKeys.friendshipStatus(variables.userId),
  //       {
  //         ...data,
  //         isNotSynced: false,
  //       }
  //     );

  //     // Controllo se erano amici: in case affermativo allora aggiorno anche i friends count
  //     if (friendshipStatusData && friendshipStatusData.isFriend) {
  //       // Refetch dei friends count
  //       queryClient.refetchQueries({
  //         queryKey: ProfileKeys.friendsCount,
  //         exact: true,
  //       });
  //     }
  //   },
  // });

  const denyFriendshipMutation = useDenyFriendship();

  const acceptFriendshipMutation = useAcceptFriendship();

  const createFriendshipMutation = useCreateFriendship();

  const destroyFriendshipMutation = useDestroyFriendship();

  React.useEffect(() => {
    return () => dismissAll();
  }, []);

  React.useEffect(() => {
    let userHasImage = false;

    if (route.params && route.params.profilePicture) userHasImage = true;
    if (userProfileData && userProfileData.profilePicture) userHasImage = true;

    navigation.setOptions({
      // Se l'utente non ha la foto profilo allora renderizzo il suo username nella navbar
      headerTitle:
        !userHasImage || isErrorUserProfile
          ? userProfileData
            ? userProfileData.username
            : route.params
            ? route.params.username
            : ""
          : "",
      headerTransparent: true,
      headerBackground: () => {
        if (userHasImage && !isErrorUserProfile) {
          return (
            <LinearGradient
              colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.5)", "transparent"]}
              locations={[0, 0.5, 1]}
              style={{
                flex: 1,
              }}
            />
          );
        }
        return <View flex={1} />;
      },

      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={handlePresentModalPress}
            disabled={!userProfileData || !friendshipStatusData}
          >
            <Icon
              as={ThreeDotsIcon}
              size="xl"
              color={
                colorMode === "dark" || userHasImage
                  ? "$textDark0"
                  : "$textLight950"
              }
            />
          </TouchableOpacity>
        );
      },
      headerLeft: () => (
        <TouchableOpacity onPress={goBack}>
          <Icon
            as={ChevronLeftIcon}
            size="xl"
            color={
              colorMode === "dark" || userHasImage
                ? "$textDark0"
                : "$textLight950"
            }
          />
        </TouchableOpacity>
      ),
    });
  }, [
    navigation,
    route.params,
    userProfileData,
    colorMode,
    friendshipStatusData,
    isErrorUserProfile,
  ]);

  React.useEffect(() => {
    // Nel caso l'utente sia bloccato lo riporto alla schermata precedente
    if (friendshipStatusData && friendshipStatusData.isBlocking) goBack();
  }, [friendshipStatusData]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const goBack = () => navigation.goBack();

  const goToMutualFriends = () => {
    // Controllo se si sono caricati gli amici in comune
    var total =
      route.params && route.params.mutualFriends !== undefined
        ? route.params.mutualFriends
        : 0;

    if (mutualFriendsData && mutualFriendsData.pages.length > 0) {
      total = mutualFriendsData.pages[0].total;
    }

    // Va alla schermata degli amici in comune
    navigation.push("MutualFriends", {
      id: route.params.id,
      total: total,
    });
  };

  const accept = (userId: number) => {
    acceptFriendshipMutation.mutate({ userId, tokenApi });
  };

  const reject = (userId: number) => {
    Alert.alert(
      i18n.t("rejectAlert.title"),
      i18n.t("rejectAlert.description"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("reject"),
          onPress: () => {
            denyFriendshipMutation.mutate({ userId, tokenApi });
          },
          style: "destructive",
        },
      ]
    );
  };

  const send = (userId: number) => {
    createFriendshipMutation.mutate({ userId, tokenApi });
  };

  const cancel = (userId: number) => {
    destroyFriendshipMutation.mutate({ userId, tokenApi });
  };

  const destroy = (userId: number, username: string) => {
    Alert.alert(
      i18n.t("unfriendUserAlert.title", {
        username: username,
      }),
      i18n.t("unfriendUserAlert.description", {
        username: username,
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
            destroyFriendshipMutation.mutate({ userId, tokenApi });
          },
        },
      ]
    );
  };

  const block = (userId: number, username: string) => {
    Alert.alert(
      i18n.t("blockUserAlert.title", {
        username: username,
      }),
      i18n.t("blockUserAlert.description", {
        username: username,
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
            // blockUserMutation.mutate({ userId });
          },
        },
      ]
    );
  };

  if (isErrorUserProfile) {
    return (
      <View
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
        paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      >
        <Text>
          {errorUserProfile &&
          isErrorResponse(errorUserProfile) &&
          errorUserProfile.statusCode === 404
            ? i18n.t("errors.userNotFound")
            : i18n.t("errors.generic")}
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="transparent" paddingBottom={insets.bottom}>
      <StatusBar
        style={
          colorMode === "light"
            ? (route.params && route.params.profilePicture) ||
              (userProfileData && userProfileData.profilePicture)
              ? "light"
              : "dark"
            : "light"
        }
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsVerticalScrollIndicator={true}
      >
        {(route.params && route.params.profilePicture) ||
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
                : route.params.profilePicture
                ? route.params.profilePicture.url
                : undefined
            }
            fullname={
              userProfileData
                ? userProfileData.fullname
                : route.params?.fullname
            }
            username={
              userProfileData
                ? userProfileData.username
                : route.params?.username
            }
            streak={
              userProfileData ? userProfileData.streak : route.params?.streak
            }
          />
        ) : (
          <Header
            headerHeight={headerHeight}
            username={
              userProfileData
                ? userProfileData.username
                : route.params?.username
            }
            fullname={
              userProfileData
                ? userProfileData.fullname
                : route.params?.fullname
            }
            isLoading={isLoadingUserProfile}
            streak={
              userProfileData ? userProfileData.streak : route.params?.streak
            }
          />
        )}
        <View
          paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
          paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
          paddingTop={20}
          gap={16}
          backgroundColor="transparent"
        >
          <FriendshipStatus
            variant={route.params?.friendshipLoader}
            isLoading={isLoadingFriendshipStatus}
            friendshipStatus={friendshipStatusData}
            username={
              userProfileData
                ? userProfileData.username
                : route.params?.username
            }
            onPressAdd={() => send(route.params.id)}
            onPressAccept={() => accept(route.params.id)}
            onPressCancel={() => cancel(route.params.id)}
            onPressDeny={() => reject(route.params.id)}
            // isLoadingAdd={sendFriendshipRequestMutation.isPending}
            // isLoadingAccept={acceptFriendshipRequestMutation.isPending}
            // isLoadingCancel={destroyFriendshipRequestMutation.isPending}
            // isLoadingDeny={rejectFriendshipRequestMutation.isPending}
          />

          <SocialContext
            onPress={goToMutualFriends}
            isLoading={isLoadingMutualFriends}
            totalMutualFriends={
              mutualFriendsData
                ? mutualFriendsData.pages && mutualFriendsData.pages.length > 0
                  ? mutualFriendsData.pages[0].total
                  : 0
                : route.params && route.params.mutualFriends
                ? route.params.mutualFriends
                : undefined
            }
            mutualFriends={
              mutualFriendsData &&
              mutualFriendsData.pages &&
              mutualFriendsData.pages.length > 0
                ? mutualFriendsData.pages[0].data
                : []
            }
          />

          {
            // Se route.params.biography è undefined oppure null, e sto caricando il profile non mostro niente, altrimenti mostro il loader
            !route.params.biography && isLoadingUserProfile ? null : (
              <Biography
                biography={
                  userProfileData
                    ? userProfileData.biography
                    : route.params?.biography
                }
                isLoading={isLoadingUserProfile}
              />
            )
          }

          <View
            height={100}
            width="$full"
            backgroundColor="transparent"
            borderRadius="$lg"
            borderColor={
              colorMode === "dark" ? "$borderDark400" : "$borderLight700"
            }
            borderWidth={0.5}
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="$2"
            gap="$1"
          >
            <View
              borderRadius="$lg"
              width={80}
              height={80}
              flexDirection="row"
              justifyContent="center"
              backgroundColor="transparent"
              alignContent="center"
              overflow="hidden"
            >
              <View height={80} width={40} backgroundColor="blue" />
              <View height={80} width={40} backgroundColor="red" />
            </View>
            <View
              backgroundColor="transparent"
              flex={1}
              height={80}
              justifyContent="flex-end"
            >
              <Text
                isTruncated
                flexShrink={1}
                fontFamily="Inter_700Bold"
                size="md"
              >
                {userProfileData?.username} & ufo
              </Text>
              <Text
                isTruncated
                flexShrink={1}
                fontFamily="Inter_400Regular"
                size="sm"
              >
                2 mn ago
              </Text>
            </View>
          </View>
        </View>

        {/* <View
          paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
          // paddingRight={insets.right + Layout.DefaultMarginHorizontal} // Non li metto perchè ci saranno due carousel e sta bene se escono fuori dallo schermo
          gap={16}
          backgroundColor="transparent"
        >
          {carouselUsers.length > 0 ? (
            <View gap={8} width="100%" backgroundColor="transparent">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
                backgroundColor="transparent"
              >
                <Text
                  // fontFamily="Inter-SemiBold"
                  fontSize="$lg"
                  lineHeight="$lg"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                >
                  {i18n.t("mutualFriends")}
                </Text>
                <Button
                  variant="link"
                  size="sm"
                  onPress={onPressSeeAll}
                  isDisabled={isLoadingMutualFriends}
                >
                  <ButtonText>{i18n.t("seeAll")}</ButtonText>
                  <ButtonIcon as={ArrowRightIcon} size="sm" />
                </Button>
              </View>
              <Carousel
                vertical={false}
                width={FRIEND_CARD_WIDTH + FRIEND_CARD_MARGIN}
                height={FRIEND_CARD_HEIGHT}
                style={{
                  width: SCREEN_WIDTH,
                }}
                loop={false}
                autoPlay={false}
                data={carouselUsers}
                renderItem={({ item, index }) => (
                  <FriendCard
                    key={index}
                    username={item?.username}
                    fullname={item?.fullname}
                    profilePictureUrl={item?.profilePicture?.url}
                    profilePictureBlurHash={item?.profilePicture?.blurHash}
                  />
                )}
              />
            </View>
          ) : isLoadingMutualFriends ? (
            <View
              width="100%"
              backgroundColor="transparent"
              flexDirection="row"
              gap={FRIEND_CARD_MARGIN}
              paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
            >
              {Array.from(
                Array(
                  route.params &&
                    route.params.mutualFriends &&
                    route.params.mutualFriends >= 0
                    ? route.params.mutualFriends
                    : Math.ceil(SCREEN_WIDTH / FRIEND_CARD_WIDTH)
                ).keys()
              ).map((_, index) => (
                <FriendCard isLoading key={index} />
              ))}
            </View>
          ) : null}
        </View> */}
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
          flex={1}
          backgroundColor="transparent"
          paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
          paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
        >
          {userProfileData ? (
            <>
              <BottomSheetItem
                iconAs={ShareIcon}
                label={i18n.t(
                  "userProfileScreenScreen.bottomSheetModal.share",
                  {
                    username: userProfileData.username,
                  }
                )}
                withDivider
              />
              {friendshipStatusData && !friendshipStatusData.isBlocking && (
                <BottomSheetItem
                  iconAs={SlashIcon}
                  label={i18n.t("userProfileScreen.bottomSheetModal.block", {
                    username: userProfileData.username,
                  })}
                  withDivider
                  variant="danger"
                  onPress={() =>
                    block(userProfileData.id, userProfileData.username)
                  }
                />
              )}
              {friendshipStatusData && friendshipStatusData.isFriend && (
                <BottomSheetItem
                  iconAs={UserMinus2Icon}
                  label={i18n.t("userProfileScreen.bottomSheetModal.unfriend")}
                  withDivider
                  variant="danger"
                  onPress={() =>
                    destroy(userProfileData.id, userProfileData.username)
                  }
                />
              )}
              <BottomSheetItem
                iconAs={TriangleIcon}
                label={i18n.t("userProfileScreen.bottomSheetModal.report", {
                  username: userProfileData.username,
                })}
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
