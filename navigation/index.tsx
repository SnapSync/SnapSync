import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { RootStackParamList } from "@/types";
import AuthStack from "./auth.stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import MainStack from "./main.stack";
import { login, setUserId } from "@/redux/features/auth/authSlice";
import { useConnectivity } from "@/hooks/useConnectivity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginWithAuthToken } from "@/api/routes/auth.routes";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import i18n from "@/lang";
import { instanceOfErrorResponseType } from "@/api";
import { SnapSyncErrorType } from "@/api/errors_types";
import {
  Text,
  Button,
  ButtonText,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import UserProfileStack from "./user_profile.stack";
import UserSettingsStack from "./user_settings.stack";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  authToken?: string;
  userId?: number;
};

const RootNavigation = ({ authToken, userId }: Props) => {
  const { isConnected } = useConnectivity();

  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  // const userIdRedux = useSelector((state: RootState) => state.auth.userId);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const [authTokenState, setAuthTokenState] = React.useState<
    string | undefined
  >(authToken);
  const [isLoading, setIsLoading] = React.useState(true);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalBody, setModalBody] = React.useState<string>(
    i18n.t("errors.authTokenModal.description")
  );

  const loginWithAuthTokenMutation = useMutation({
    mutationFn: (data: { authToken: string }) =>
      LoginWithAuthToken(data.authToken),
    onSuccess: async (data) => {
      let accessToken = data.data.accessToken;
      await SecureStore.setItemAsync(AuthTokenKey, accessToken); // Salvo il token nello storage per il prossimo login

      // Salvo lo UserId nello storage
      let userId = data.data.userId;
      await SecureStore.setItemAsync(UserIdKey, userId.toString());

      dispatch(login(data.data));

      // setAuthTokenState(accessToken);
      setIsLoading(false);
    },
    onError: async (error) => {
      setIsLoading(false);
      if (error && instanceOfErrorResponseType(error)) {
        await SecureStore.deleteItemAsync(AuthTokenKey);
        await SecureStore.deleteItemAsync(UserIdKey);

        if (
          error.statusCode === 403 &&
          error.type &&
          error.type === SnapSyncErrorType.SnapSyncUserBannedError
        ) {
          setModalBody(
            i18n.t("errors.authTokenModal.userBanned", {
              email: "todo@snapsync.net",
            })
          );
        } else if (error.statusCode === 500) {
          // TODO: fare un modal con un messaggio generico, ma non mostrare il pulsante per fare il logout
        }
      }

      setModalVisible(true);
    },
  });

  React.useEffect(() => {
    if (!isLoggedIn && authTokenState && isConnected) {
      loginWithAuthTokenMutation.mutate({ authToken: authTokenState });
    } else {
      setIsLoading(false);
    }
  }, [isConnected, authTokenState, isLoggedIn]);

  // React.useEffect(() => {
  //   if (userId && !userIdRedux) {
  //     // Salvo lo UserId in redux
  //     dispatch(setUserId(userId));
  //   }
  // }, [userIdRedux, userId]);

  React.useEffect(() => {
    if (isLoggedIn) {
      // Lo faccio così da permettere di fare il logout
      setAuthTokenState(undefined);
    }
  }, [isLoggedIn]);

  const _onPress = async () => {
    await SecureStore.deleteItemAsync(AuthTokenKey);
    await SecureStore.deleteItemAsync(UserIdKey);

    // Rimuovo tutte le query dalla cache
    queryClient.clear();

    setModalVisible(false);
    setAuthTokenState(undefined);
  };

  if (isLoading) {
    // TODO: fare un loading screen magari con lotie
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>CARICAMENTO...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Navigator>
        {isLoggedIn || authTokenState ? (
          <Stack.Group>
            <Stack.Screen
              name="MainStack"
              component={MainStack}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="UserProfileStack"
              component={UserProfileStack}
              options={{
                headerShown: false,
                gestureEnabled: false,
                // animation: "fade",
                // customAnimationOnGesture: true,
                // fullScreenGestureEnabled: true,
                // gestureDirection: "vertical",
              }}
            />
            <Stack.Screen
              name="UserSettingsStack"
              component={UserSettingsStack}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthStack" component={AuthStack} />
          </Stack.Group>
        )}
      </Stack.Navigator>

      <Modal isOpen={modalVisible}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading
              // fontFamily="Inter-SemiBold"
              fontSize="$lg"
              lineHeight="$lg"
            >
              {i18n.t("errors.authTokenModal.title")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text
              style={{
                // fontFamily: "Inter-Regular",
                fontSize: 12,
                lineHeight: 20,
              }}
            >
              {modalBody}
            </Text>
          </ModalBody>
          <ModalFooter
            borderTopColor={
              colorMode === "dark" ? "$borderDark400" : "$borderLight400"
            }
            borderTopWidth={1}
          >
            <Button
              size="lg"
              action="primary"
              width="100%"
              variant="solid"
              onPress={_onPress}
              rounded="$lg"
            >
              <ButtonText>{i18n.t("exit")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RootNavigation;
