import {
  Button,
  useColorMode,
  Text,
  KeyboardAvoidingView,
  Input,
  InputField,
  View,
  useToast,
  Toast,
  ToastTitle,
  VStack,
  ToastDescription,
  ButtonSpinner,
  ButtonText,
} from "@gluestack-ui/themed";
import { Keyboard, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { AuthStackScreenProps } from "@/types";
import styles from "../auth.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import {
  resetAuthDto,
  updateUsername,
} from "@/redux/features/authentication/authenticationSlice";
import i18n from "@/lang";
import {
  AuthUsernameMaxLength,
  AuthUsernameMinLength,
  AuthUsernameRegex,
} from "../auth.costants";
import ErrorText from "@/components/error_text/error_text.component";
import { useMutation } from "@tanstack/react-query";
import { SignUp, ValidateUsername } from "@/api/routes/auth.routes";
import { instanceOfErrorResponseType } from "@/api";
import { login } from "@/redux/features/auth/authSlice";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey } from "@/costants/SecureStoreKeys";
import { useConnectivity } from "@/hooks/useConnectivity";

const UsernameScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<"Username">) => {
  const toast = useToast();

  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const { isConnected } = useConnectivity();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const validateUsernameMutation = useMutation({
    mutationFn: (data: {
      username: string;
      sessionId: string;
      deviceUuid: string;
    }) => ValidateUsername(data.username, data.sessionId, data.deviceUuid),
    onError: (error) => {
      let message = i18n.t("errors.generic");
      let title: string | null = null;

      if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 422
      ) {
        title = i18n.t("errors.unprocessableEntityTitle");
        message = error.message;
      } else if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 409
      ) {
        // Qualcuno ha già il nome utente
        message = i18n.t("errors.usernameAlreadyExists");
      }

      // Mostro il toast
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="accent">
              <VStack space="xs">
                {title && <ToastTitle>{title}</ToastTitle>}
                <ToastDescription>{message}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: { sessionId: string; deviceUuid: string }) =>
      SignUp(data.sessionId, data.deviceUuid),
    onError: (error) => {
      let message = i18n.t("errors.generic");
      let title: string | null = null;

      if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 409
      ) {
        // Qualcuno ha già il nome utente oppure il numero di telefono
        message = i18n.t("errors.usernameOrPhoneAlreadyExists");
      }

      // Mostro il toast
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="accent">
              <VStack space="xs">
                {title && <ToastTitle>{title}</ToastTitle>}
                <ToastDescription>{message}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    },
  });

  React.useEffect(() => {
    if (
      validateUsernameMutation.isSuccess &&
      authDto.sessionId &&
      route.params.DeviceUuid &&
      isConnected
    ) {
      signupMutation.mutate({
        sessionId: authDto.sessionId,
        deviceUuid: route.params.DeviceUuid,
      });
    }
  }, [
    validateUsernameMutation.isSuccess,
    authDto.sessionId,
    isConnected,
    route.params.DeviceUuid,
  ]);

  React.useEffect(() => {
    if (signupMutation.data) {
      let accessToken = signupMutation.data.data.accessToken;
      _saveAuthToken(accessToken); // Mi salvo il token per attivare il login in automatico al prossimo avvio dell'app

      // Resetto il dto in redux
      dispatch(resetAuthDto());

      // Faccio il login
      dispatch(login(signupMutation.data.data));
    }
  }, [signupMutation.data, dispatch]);

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _saveAuthToken = async (token: string) => {
    await SecureStore.setItemAsync(AuthTokenKey, token);
  };

  const _handleChangeText = (text: string) => {
    dispatch(updateUsername(text));
  };

  const _handlePressContinue = () => {
    Keyboard.dismiss();

    if (!isConnected) {
      // Mostro il toast
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="warning" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.noInternetConnection")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Il primo carattere deve essere maiuscolo
    let field =
      i18n.t("fields.username").charAt(0).toUpperCase() +
      i18n.t("fields.username").slice(1);

    let errorMessage: string | null = null;

    if (!authDto.username) {
      errorMessage = i18n.t("errors.required", {
        field: field,
      });
    } else {
      // Controllo la lunghezza
      if (authDto.username.length < AuthUsernameMinLength) {
        errorMessage = i18n.t("errors.minLenght", {
          field: field,
          minLenght: AuthUsernameMinLength,
        });
      }

      if (authDto.username.length > AuthUsernameMaxLength) {
        errorMessage = i18n.t("errors.maxLenght", {
          field: field,
          maxLenght: AuthUsernameMaxLength,
        });
      }

      // Controllo il regex
      if (!AuthUsernameRegex.test(authDto.username)) {
        errorMessage = i18n.t("errors.regex", {
          field: field,
        });
      }
    }

    if (errorMessage && errorMessage.length > 0) {
      // Mostro il toast
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>
                  {i18n.t("errors.unprocessableEntityTitle")}
                </ToastTitle>
                <ToastDescription>{errorMessage}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      return;
    }

    if (authDto.username && route.params.DeviceUuid && authDto.sessionId) {
      validateUsernameMutation.mutate({
        username: authDto.username,
        sessionId: authDto.sessionId,
        deviceUuid: route.params.DeviceUuid,
      });
    } else {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>{i18n.t("errors.generic")}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  };

  if (!authDto.sessionId || !route.params.DeviceUuid) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ErrorText />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        paddingTop: insets.top,
        // paddingBottom: insets.bottom,
        paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
        paddingRight: insets.right + Layout.DefaultMarginHorizontal,
        flexDirection: "column",
      }}
      onTouchStart={_dismissKeyboard}
      bgColor={
        colorMode === "light" ? "$backgroundLight0" : "$backgroundDark950"
      }
    >
      <View style={styles.viewHeader}>
        <View style={styles.viewFormHeader}>
          <Text
            style={styles.textTitle}
            color={colorMode === "light" ? "$textLight950" : "$textDark0"}
          >
            {i18n.t("auth.username.title")}
          </Text>
          <Text
            style={styles.textSubTitle}
            color={colorMode === "light" ? "$textLight700" : "$textDark400"}
          >
            {i18n.t("auth.username.subtitle")}
          </Text>
        </View>
        <Input
          size={"sm"}
          variant={"underlined"}
          isInvalid={false}
          isDisabled={false}
          isRequired={true}
        >
          <InputField
            onChangeText={_handleChangeText}
            value={authDto.username}
            autoFocus={true}
            maxLength={AuthUsernameMaxLength}
            keyboardAppearance={colorMode === "light" ? "light" : "dark"}
            selectionColor={colorMode === "dark" ? "white" : "black"}
          />
        </Input>
      </View>
      <View
        style={[
          styles.viewFooter,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Button
          action={"primary"}
          variant={"solid"}
          size={"lg"}
          isDisabled={
            !authDto.username ||
            authDto.username.length < AuthUsernameMinLength ||
            authDto.username.length > AuthUsernameMaxLength ||
            !AuthUsernameRegex.test(authDto.username) ||
            validateUsernameMutation.isPending ||
            signupMutation.isPending
          }
          borderRadius={14}
          width={"100%"}
          onPress={_handlePressContinue}
        >
          {validateUsernameMutation.isPending || signupMutation.isPending ? (
            <ButtonSpinner size="small" />
          ) : (
            <ButtonText>
              {
                // Prima lettera maiuscola
                i18n.t("signup").charAt(0).toUpperCase() +
                  i18n.t("signup").slice(1)
              }
            </ButtonText>
          )}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
export default UsernameScreen;
