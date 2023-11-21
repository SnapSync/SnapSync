import { TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey } from "@/costants/SecureStoreKeys";
import {
  View,
  Button,
  ButtonText,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  useColorMode,
  Text,
  ModalFooter,
  Icon,
} from "@gluestack-ui/themed";
import { login, logout } from "@/redux/features/auth/authSlice";
import { MainStackScreenProps } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginWithAuthToken } from "@/api/routes/auth.routes";
import { useConnectivity } from "@/hooks/useConnectivity";
import { instanceOfErrorResponseType } from "@/api";
import { SnapSyncErrorType } from "@/api/errors_types";
import i18n from "@/lang";
import { FetchMe } from "@/api/routes/users.route";
import AnimatedHeader from "@/components/animted_header/animted_header.component";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import UserAvatar from "@/components/user_avatar/user_avatar.component";
import { Users2Icon } from "lucide-react-native";
import { Layout } from "@/costants/Layout";

const HEADER_HEIGHT = 56;

const HomeScreen = ({ navigation }: MainStackScreenProps<"Home">) => {
  const { isConnected } = useConnectivity();
  const colorMode = useColorMode();

  const insets = useSafeAreaInsets();

  const queryClient = useQueryClient();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const authToken = useSelector((state: RootState) => state.auth.authToken);

  const dispatch = useDispatch();

  const translateY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const [i18nModalTitleKey, setI18nModalTitleKey] = useState<string>(
    "home.modalAuth.title"
  );
  const [i18nModalMessageKey, setI18nModalMessageKey] = useState<string>(
    "home.modalAuth.body"
  );
  const [modalVisible, setModalVisible] = useState(false);

  const loginWithAuthTokenMutation = useMutation({
    mutationFn: (data: { authToken: string }) =>
      LoginWithAuthToken(data.authToken),
    onSuccess: async (data) => {
      let accessToken = data.data.accessToken;
      await SecureStore.setItemAsync(AuthTokenKey, accessToken); // Salvo il token nello storage

      dispatch(login(data.data));
    },
    onError: async (error) => {
      if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 403 &&
        error.type &&
        error.type === SnapSyncErrorType.SnapSyncUserBannedError
      ) {
        // Dopo che l'utente preme il pulsante "OK" per chiudere il modal, devo fare il logout

        setI18nModalTitleKey("home.modalBannedUser.title");
        setI18nModalMessageKey("home.modalBannedUser.body");

        setModalVisible(true);
      }

      setModalVisible(true);
    },
  });

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => FetchMe(tokenApi),
    enabled: isLoggedIn && isConnected ? true : false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: true,
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = 0;
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = -HEADER_HEIGHT - insets.top;
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: (e) => {
      isScrolling.value = true;
    },
    onEndDrag: (e) => {
      isScrolling.value = false;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!isLoggedIn && authToken && isConnected) {
        // Provo a fare il login con l'authToken
        _handleLoginWithAuthToken(authToken);
      }
    }, [isLoggedIn, authToken, isConnected])
  );

  const _handleLoginWithAuthToken = async (token: string) => {
    // Faccio il login con l'authToken
    loginWithAuthTokenMutation.mutate({
      authToken: token,
    });
  };

  const _onPressLogout = async () => {
    // Rimuovo il token dallo storage
    await SecureStore.deleteItemAsync(AuthTokenKey);

    // Rimuovo tutte le query dalla cache
    queryClient.clear();

    // Rimuovo il token dallo store
    dispatch(logout());
  };

  const _onPressAvatar = () => {
    navigation.navigate("MyUserProfile", {
      screen: "UserProfile",
    });
  };

  // TODO: https://tanstack.com/query/latest/docs/react/react-native#online-status-management

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <AnimatedHeader
        animatedValue={translateY}
        height={HEADER_HEIGHT + insets.top}
        withDarkMode={colorMode === "dark" ? true : false}
        leftComponent={
          <AnimatedHeaderLeftComponent
            marginLeft={insets.left + 10}
            paddingTop={insets.top}
            mode={colorMode === "dark" ? "dark" : "light"}
          />
        }
        rightComponent={
          <AnimatedHeaderRightComponent
            marginRight={insets.right + 10}
            paddingTop={insets.top}
            userAvatarUrl={data?.profilePicture?.url}
            onPress={_onPressAvatar}
            username={data?.username}
          />
        }
        centerComponent={
          <AnimatedHeaderCenterComponent paddingTop={insets.top} />
        }
      />

      <Animated.FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: "100%",
                height: 100,
                backgroundColor: "red",
                marginBottom: 10,
              }}
            />
          );
        }}
        // onRefresh={() => timelineRefetch()}
        // refreshing={timelineIsRefetching}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefetching}
        //     progressViewOffset={HEADER_HEIGHT + insets.top}
        //     onRefresh={() => refetch()}
        //   />
        // }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top,
        }}
        scrollEnabled={true}
      />

      <Modal
        isOpen={modalVisible}
        // onClose={() => setModalVisible(false)}
        // finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading fontFamily="Inter-SemiBold" fontSize={16}>
              {i18n.t(i18nModalTitleKey)}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                lineHeight: 20,
              }}
            >
              {i18n.t(i18nModalMessageKey)}
            </Text>
          </ModalBody>
          <ModalFooter
            style={{
              borderTopColor: colorMode === "dark" ? "#2D3748" : "#E2E8F0",
              borderTopWidth: 1,
              marginTop: 16,
            }}
          >
            <Button
              size="xs"
              action="primary"
              width="100%"
              variant="solid"
              onPress={_onPressLogout}
            >
              <ButtonText>{i18n.t("login")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const AnimatedHeaderLeftComponent = ({
  marginLeft,
  paddingTop,
  mode,
}: {
  marginLeft: number;
  paddingTop: number;
  mode?: "light" | "dark";
}) => {
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
        marginLeft: marginLeft,
        paddingTop: paddingTop,
        backgroundColor: "transparent",
      }}
    >
      <TouchableOpacity
        style={{
          marginLeft: 10,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          as={Users2Icon}
          size="sm"
          color={mode === "dark" ? Layout.LightBgc : Layout.DarkBgc}
        />
      </TouchableOpacity>
    </View>
  );
};

const AnimatedHeaderRightComponent = ({
  marginRight,
  paddingTop,
  userAvatarUrl,
  userAvatarBlurHash,
  username,
  onPress,
}: {
  marginRight: number;
  paddingTop: number;
  userAvatarUrl?: string;
  userAvatarBlurHash?: string;
  username?: string;
  onPress?: () => void;
}) => {
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "flex-end",
        marginRight: marginRight,
        paddingTop: paddingTop,
        backgroundColor: "transparent",
      }}
    >
      <TouchableOpacity
        style={{
          marginLeft: 10,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPress}
      >
        <UserAvatar
          avatarUrl={userAvatarUrl}
          avatarBlurHash={userAvatarBlurHash}
          username={username}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
};

const AnimatedHeaderCenterComponent = ({
  paddingTop,
}: {
  paddingTop: number;
}) => {
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        paddingTop: paddingTop,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <Image
        source={{
          uri: "https://1000marche.net/wp-content/uploads/2020/03/Instagram-Logo-2010-2013.png",
        }}
        style={{
          width: 100,
          height: 30,
        }}
      />
    </View>
  );
};
