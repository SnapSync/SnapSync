import {
  useColorMode,
  KeyboardAvoidingView,
  useToast,
  Toast,
  VStack,
  ToastDescription,
  Icon,
  ChevronLeftIcon,
  Input,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { Platform, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";
import { AuthStackScreenProps } from "@/types";
import { resetAuthDto } from "@/redux/features/authentication/authenticationSlice";
import {
  ResendPhoneNumberVerificationCode,
  ValidatePhoneNumberVerificationCode,
} from "@/api/routes/auth.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCountdown } from "usehooks-ts";
import { login } from "@/redux/features/auth/authSlice";
import { AuthTokenKey } from "@/costants/SecureStoreKeys";
import * as SecureStore from "expo-secure-store";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import { OPT_LENGTH } from "./otp.costants";
import SnapSyncErrors from "@/api/api_errors";
import authKeys from "../auth.keys";
import { isErrorResponse } from "@/api/api_responses.types";
import BackBtn from "@/components/back_btn/back_btn.component";
// import { identifyDevice } from "vexo-analytics";
import { ILoginResponse } from "@/interfaces/auth.interface";

const OtpScreen = ({ navigation, route }: AuthStackScreenProps<"Otp">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const toast = useToast();

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const queryClient = useQueryClient();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const resendOtpMutation = useMutation({
    mutationFn: (data: { sessionId: string }) =>
      ResendPhoneNumberVerificationCode(data.sessionId),
    onSuccess: () => {
      resetCountdown(); // Resetto il countdown
      startCountdown(); // Avvio il countdown
    },
  });

  const validateOtpMutation = useMutation({
    mutationFn: (data: { otp: string; sessionId: string }) =>
      ValidatePhoneNumberVerificationCode(data.otp, data.sessionId),
    onError: (error) => {
      if (
        error &&
        isErrorResponse(error) &&
        error.statusCode === 403 &&
        error.type === SnapSyncErrors.SnapSyncUserBannedError
      ) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id;
            return (
              <Toast nativeID={toastId} action="error" variant="accent">
                <VStack space="xs">
                  <ToastDescription>
                    {i18n.t("errors.userBanned")}
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      } else if (error && isErrorResponse(error) && error.statusCode === 401) {
        // Non faccio nulla, poichè mostro l'errore direttamente nel FormControl
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id;
            return (
              <Toast nativeID={toastId} action="error" variant="accent">
                <VStack space="xs">
                  <ToastDescription>
                    {i18n.t("errors.generic")}
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      }
    },
  });

  React.useEffect(() => {
    startCountdown();
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackBtn onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  React.useEffect(() => {
    const handleLogin = async (data: ILoginResponse) => {
      let accessToken = data.accessToken;
      await _saveAuthToken(accessToken); // Mi salvo il token per attivare il login in automatico al prossimo avvio dell'app

      // Mi salvo lo UserId
      // let userId = validateOtpMutation.data.data.userId;
      // _saveUserId(userId.toString());

      // Identificatore del dispositivo
      // await identifyDevice(data.vexoToken);

      // Resetto il dto in redux
      dispatch(resetAuthDto());

      // Faccio il login
      dispatch(login(data));

      // Rimuovo la query con key ["session"] in modo da non avere più il sessionId salvato
      queryClient.removeQueries({
        queryKey: authKeys.session,
        exact: true,
      });
    };

    if (validateOtpMutation.data) {
      // Controllo se l'utente esiste già
      let goNext = validateOtpMutation.data.goNext;

      if (goNext) {
        // Passo alla schermata per inserire lo username
        navigation.navigate("Username");
      } else if (validateOtpMutation.data.data) {
        handleLogin(validateOtpMutation.data.data);
      }
    }
  }, [validateOtpMutation.data, navigation, dispatch]);

  const _handlePressResend = () => {
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

  const _onChangeText = (code: string) => {
    if (code.length === OPT_LENGTH) {
      _onCodeFilled(code);
    } else if (code.length > OPT_LENGTH) {
      return;
    }
  };

  const _onCodeFilled = (code: string) => {
    if (!authDto.sessionId) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.auth.sessionIdNotFound")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      return;
    }

    validateOtpMutation.mutate({
      otp: code,
      sessionId: authDto.sessionId,
    });
  };

  const _saveAuthToken = async (token: string) => {
    await SecureStore.setItemAsync(AuthTokenKey, token);
  };

  return (
    <KeyboardAvoidingView
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      paddingTop={insets.top}
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      bgColor="transparent"
      alignItems="center"
    >
      <TopSection
        title={i18n.t("otpScreen.topSectionTitle")}
        subtitle={i18n.t("otpScreen.topSectionSubtitle", {
          phoneNumber: authDto.phoneNumber,
        })}
      >
        <FormControl
          width={"100%"}
          isDisabled={validateOtpMutation.isPending}
          isInvalid={
            validateOtpMutation.isError &&
            validateOtpMutation.error &&
            isErrorResponse(validateOtpMutation.error) &&
            validateOtpMutation.error.statusCode === 401
          }
        >
          <Input borderWidth={0} height="$10">
            <InputField
              keyboardType="number-pad"
              placeholder={"******"}
              autoFocus={true}
              autoComplete="sms-otp"
              keyboardAppearance={colorMode === "dark" ? "dark" : "light"}
              onChangeText={_onChangeText}
              fontFamily="Inter_900Black"
              size="3xl"
              textAlign="center"
              letterSpacing={20}
            />
          </Input>
          {validateOtpMutation.isError &&
            validateOtpMutation.error &&
            isErrorResponse(validateOtpMutation.error) &&
            validateOtpMutation.error.statusCode === 401 && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText flexShrink={1}>
                  {i18n.t("errors.otp.invalid")}
                </FormControlErrorText>
              </FormControlError>
            )}
        </FormControl>
      </TopSection>

      <BottomSection
        buttonLabel={
          count === 0
            ? i18n.t("otpScreen.resend")
            : i18n.t("otpScreen.resendIn", {
                seconds: count,
              })
        }
        onPress={_handlePressResend}
        isLoading={resendOtpMutation.isPending || validateOtpMutation.isPending}
        isDisabled={
          resendOtpMutation.isPending ||
          count > 0 ||
          validateOtpMutation.isPending
        }
      />
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
