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
import {
  resetAuthDto,
  updatePhoneNumberVerificationCode,
} from "@/redux/features/authentication/authenticationSlice";
import {
  ResendPhoneNumberVerificationCode,
  ValidatePhoneNumberVerificationCode,
} from "@/api/routes/auth.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCountdown } from "usehooks-ts";
import { instanceOfErrorResponseType } from "@/api";
import { login } from "@/redux/features/auth/authSlice";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import * as SecureStore from "expo-secure-store";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import { OPT_LENGTH } from "./otp.costants";
import { SnapSyncErrorType } from "@/api/errors_types";
import authKeys from "../auth.keys";

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
  });

  React.useEffect(() => {
    startCountdown();
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={validateOtpMutation.isPending}
        >
          <Icon
            as={ChevronLeftIcon}
            size="xl"
            color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, validateOtpMutation]);

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

        // Mi salvo lo UserId
        // let userId = validateOtpMutation.data.data.userId;
        // _saveUserId(userId.toString());

        // Resetto il dto in redux
        dispatch(resetAuthDto());

        // Faccio il login
        dispatch(login(validateOtpMutation.data.data));

        // Rimuovo la query con key ["session"] in modo da non avere più il sessionId salvato
        queryClient.removeQueries({
          queryKey: authKeys.session,
          exact: true,
        });
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

    dispatch(updatePhoneNumberVerificationCode(code));
  };

  const _onCodeFilled = (code: string) => {
    if (!authDto.sessionId) {
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

  // const _saveUserId = async (userId: string) => {
  //   await SecureStore.setItemAsync(UserIdKey, userId);
  // };

  return (
    <KeyboardAvoidingView
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      paddingTop={insets.top}
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopSection title={i18n.t("auth.otp.title")}>
        <FormControl
          width={"100%"}
          isDisabled={validateOtpMutation.isPending}
          isInvalid={validateOtpMutation.isError}
        >
          <Input
            isDisabled={validateOtpMutation.isPending}
            borderWidth={0}
            height={70}
          >
            <InputField
              keyboardType="number-pad"
              placeholder={"******"}
              autoFocus={true}
              autoComplete="sms-otp"
              value={authDto.phoneNumberVerificationCode}
              keyboardAppearance={colorMode === "dark" ? "dark" : "light"}
              onChangeText={_onChangeText}
              fontFamily="Inter_900Black"
              size="3xl"
              textAlign="center"
              letterSpacing="$2xl"
            />
          </Input>
          {validateOtpMutation.isError && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText flexShrink={1}>
                {validateOtpMutation.error &&
                instanceOfErrorResponseType(validateOtpMutation.error)
                  ? validateOtpMutation.error.statusCode === 401
                    ? i18n.t("errors.otpInvalid")
                    : validateOtpMutation.error.statusCode === 403 &&
                      validateOtpMutation.error.type &&
                      validateOtpMutation.error.type ===
                        SnapSyncErrorType.SnapSyncUserBannedError
                    ? i18n.t("errors.userBanned")
                    : i18n.t("errors.generic")
                  : i18n.t("errors.generic")}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </TopSection>

      <BottomSection
        buttonLabel={
          count === 0
            ? i18n.t("resend")
            : i18n.t("resendIn", {
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
