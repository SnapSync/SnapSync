import {
  Button,
  ButtonText,
  useColorMode,
  Text,
  KeyboardAvoidingView,
  View,
  useToast,
  Toast,
  VStack,
  ToastTitle,
  ToastDescription,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { Keyboard, Platform } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import styles from "../auth.styles";
import i18n from "@/lang";
import { AuthStackScreenProps } from "@/types";
import otpStyles from "./otp.styles";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import {
  resetAuthDto,
  updatePhoneNumberVerificationCode,
} from "@/redux/features/authentication/authenticationSlice";
import { AuthOtpCodeLength } from "../auth.costants";
import {
  ResendPhoneNumberVerificationCode,
  ValidatePhoneNumberVerificationCode,
} from "@/api/routes/auth.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCountdown } from "usehooks-ts";
import ErrorText from "@/components/error_text/error_text.component";
import { instanceOfErrorResponseType } from "@/api";
import { login } from "@/redux/features/auth/authSlice";
import { AuthTokenKey } from "@/costants/SecureStoreKeys";
import * as SecureStore from "expo-secure-store";
import { useConnectivity } from "@/hooks/useConnectivity";

const OtpScreen = ({ navigation, route }: AuthStackScreenProps<"Otp">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const toast = useToast();

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const { isConnected } = useConnectivity();

  const queryClient = useQueryClient();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const [forceGoBack, setForceGoBack] = React.useState(false);

  const resendOtpMutation = useMutation({
    mutationFn: (data: { sessionId: string }) =>
      ResendPhoneNumberVerificationCode(data.sessionId),
    onSuccess: () => {
      resetCountdown(); // Resetto il countdown
    },
  });

  const validateOtpMutation = useMutation({
    mutationFn: (data: { otp: string; sessionId: string }) =>
      ValidatePhoneNumberVerificationCode(data.otp, data.sessionId),
    onError: (error) => {
      let message = i18n.t("errors.generic");
      let title: string | null = null;

      if (error && instanceOfErrorResponseType(error)) {
        if (error.statusCode === 401) {
          // Il codice inserito non è corretto
          message = i18n.t("errors.otpInvalid");
        } else if (
          error.statusCode === 403 &&
          error.type &&
          error.type === "SnapSyncUserBannedError"
        ) {
          // L'utente è stato bannato
          message = i18n.t("errors.userBanned");
        }
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
    startCountdown();
  }, []);

  React.useEffect(() => {
    // Non faccio tornare indietro l'utente, tranne se forceGoBack è true
    navigation.addListener("beforeRemove", (e) => {
      if (!forceGoBack) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      navigation.dispatch(e.data.action);
    });
  }, [navigation, forceGoBack]);

  React.useEffect(() => {
    if (validateOtpMutation.data) {
      // Controllo se l'utente esiste già
      let goNext = validateOtpMutation.data.goNext;

      if (goNext) {
        // Passo alla schermata per inserire lo username
        navigation.navigate("Username");
      } else if (validateOtpMutation.data.data) {
        let accessToken = validateOtpMutation.data.data.accessToken;
        _saveAuthToken(accessToken); // Mi salvo il token per attivare il login in automatico al prossimo avvio dell'app

        // Resetto il dto in redux
        dispatch(resetAuthDto());

        // Faccio il login
        dispatch(login(validateOtpMutation.data.data));

        // Rimuovo la query con key ["session"]
        queryClient.removeQueries({
          queryKey: ["session"],
          exact: true,
        });
      }
    }
  }, [validateOtpMutation.data, navigation, dispatch]);

  React.useEffect(() => {
    if (forceGoBack) {
      // Torno indietro nello stack a quando ho inserito il numero di telefono
      navigation.navigate("PhoneNumber");
    }
  }, [forceGoBack]);

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _handlePressResend = () => {
    Keyboard.dismiss();

    if (authDto.sessionId) {
      resendOtpMutation.mutate({
        sessionId: authDto.sessionId,
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

  const _onCodeChanged = (code: string) => {
    dispatch(updatePhoneNumberVerificationCode(code));
  };

  const _onCodeFilled = (code: string) => {
    if (authDto.sessionId && isConnected) {
      validateOtpMutation.mutate({
        otp: code,
        sessionId: authDto.sessionId,
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

  const _onPressChangeNumber = () => {
    setForceGoBack(true);
  };

  const _saveAuthToken = async (token: string) => {
    await SecureStore.setItemAsync(AuthTokenKey, token);
  };

  if (!authDto.sessionId) {
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
            {i18n.t("auth.otp.title")}
          </Text>
          <Text
            style={styles.textSubTitle}
            color={colorMode === "light" ? "$textLight700" : "$textDark400"}
          >
            {i18n.t("auth.otp.subtitle")}
          </Text>
        </View>
        <OTPInputView
          style={otpStyles.viewOptInputContainer}
          pinCount={AuthOtpCodeLength}
          autoFocusOnLoad
          code={authDto.phoneNumberVerificationCode}
          onCodeChanged={_onCodeChanged}
          onCodeFilled={_onCodeFilled}
          keyboardAppearance={colorMode === "light" ? "light" : "dark"}
          selectionColor={colorMode === "dark" ? "white" : "black"}
          codeInputHighlightStyle={{
            borderColor: colorMode === "light" ? "#004282" : "#1A91FF",
            ...otpStyles.codeInputHighlightStyle,
          }}
          codeInputFieldStyle={{
            borderColor: colorMode === "light" ? "#D4D4D4" : "#525252",
            color: colorMode === "light" ? "#171717" : "#fcfcfc",
            ...otpStyles.codeInputFieldStyle,
          }}
        />

        <Button
          variant="link"
          size="xs"
          isDisabled={
            resendOtpMutation.isPending || validateOtpMutation.isPending
          }
          onPress={_onPressChangeNumber}
        >
          <ButtonText>{i18n.t("auth.otp.changeNumber")}</ButtonText>
        </Button>
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
            resendOtpMutation.isPending ||
            count > 0 ||
            validateOtpMutation.isPending
          }
          borderRadius={14}
          width={"100%"}
          onPress={_handlePressResend}
        >
          {resendOtpMutation.isPending || validateOtpMutation.isPending ? (
            <ButtonSpinner size="small" />
          ) : (
            <ButtonText>
              {count === 0
                ? i18n.t("resend").charAt(0).toUpperCase() +
                  i18n.t("resend").slice(1)
                : i18n.t("resendIn").charAt(0).toUpperCase() +
                  i18n
                    .t("resendIn", {
                      seconds: count,
                    })
                    .slice(1)}
            </ButtonText>
          )}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
