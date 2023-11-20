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
import React, { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { AuthStackScreenProps } from "@/types";
import styles from "../auth.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import i18n from "@/lang";
import ErrorText from "@/components/error_text/error_text.component";
import phoneNumberStyles from "./phone_number.styles";
import {
  updatePhoneNumber,
  updatePhoneNumberCountryCode,
  updatePhoneNumberFormatted,
} from "@/redux/features/authentication/authenticationSlice";
import { Country, isCountryCode } from "react-native-country-picker-modal";
import PhoneNumberInput from "@/components/phone_number_input/phone_number_input.component";
import { isValidPhoneNumber } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";
import { ValidatePhoneNumber } from "@/api/routes/auth.routes";
import { instanceOfErrorResponseType } from "@/api";
import { useConnectivity } from "@/hooks/useConnectivity";

const PhoneNumberScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<"PhoneNumber">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const toast = useToast();

  const { isConnected } = useConnectivity();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );
  const appLanguage = useSelector((state: RootState) => state.app.appLanguage);

  const dispatch = useDispatch();

  const validatePhoneNumberMutation = useMutation({
    mutationFn: (data: {
      phoneNumber: string;
      sessionId: string;
      deviceUuid: string;
    }) =>
      ValidatePhoneNumber(data.sessionId, data.phoneNumber, data.deviceUuid),
    onSuccess: () => {
      navigation.navigate("Otp", {
        DeviceUuid: route.params.DeviceUuid,
      });
    },
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
    // Non faccio tornare indietro l'utente
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      return;
    });
  }, [navigation]);

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _onChangeText = (text: string) => {
    dispatch(updatePhoneNumber(text));
  };

  const _onChangeFormattedText = (text: string) => {
    dispatch(updatePhoneNumberFormatted(text));
  };

  const _onChangeCountry = (e: Country) => {
    dispatch(updatePhoneNumberCountryCode(e.cca2));
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

    // La prima lettera maiuscola
    let field =
      i18n.t("fields.phoneNumber").charAt(0).toUpperCase() +
      i18n.t("fields.phoneNumber").slice(1);
    let errorMessage: string | null = null;

    if (!authDto.phoneNumberFormatted) {
      errorMessage = i18n.t("errors.required", {
        field: field,
      });
    } else {
      // Controllo che il numero di telefono sia valido
      if (!isValidPhoneNumber(authDto.phoneNumberFormatted)) {
        errorMessage = i18n.t("errors.invalid", {
          field: field,
        });
      }
    }

    if (errorMessage && errorMessage.length > 0) {
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

    if (
      route.params.DeviceUuid &&
      authDto.sessionId &&
      authDto.phoneNumberFormatted
    ) {
      validatePhoneNumberMutation.mutate({
        phoneNumber: authDto.phoneNumberFormatted,
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
            {i18n.t("auth.phoneNumber.title")}
          </Text>
          <Text
            style={styles.textSubTitle}
            color={colorMode === "light" ? "$textLight700" : "$textDark400"}
          >
            {i18n.t("auth.phoneNumber.subtitle")}
          </Text>
        </View>
        <PhoneNumberInput
          value={authDto.phoneNumber}
          defaultCode={
            authDto.phoneNumberCountryCode &&
            isCountryCode(authDto.phoneNumberCountryCode)
              ? authDto.phoneNumberCountryCode
              : undefined
          }
          onChangeText={_onChangeText}
          onChangeFormattedText={_onChangeFormattedText}
          onChangeCountry={_onChangeCountry}
          withDarkTheme={colorMode === "dark" ? true : false}
          autoFocus
          flagSize={16}
          countryPickerButtonStyle={[
            phoneNumberStyles.viewCountryInfo,
            colorMode === "dark"
              ? phoneNumberStyles.viewCountryInfoDark
              : phoneNumberStyles.viewCountryInfoLight,
          ]}
          countryPickerProps={{
            withFlag: true,
            withFilter: false,
            withCloseButton: false,
            translation: "common", // TODO: da cambiare con la lingua dell'app
          }}
        />
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
          borderRadius={14}
          width={"100%"}
          isDisabled={
            validatePhoneNumberMutation.isPending ||
            !isValidPhoneNumber(authDto.phoneNumberFormatted)
          }
          onPress={_handlePressContinue}
        >
          {validatePhoneNumberMutation.isPending ? (
            <ButtonSpinner size="small" />
          ) : (
            <ButtonText>
              {
                // Prima lettera maiuscola
                i18n.t("continue").charAt(0).toUpperCase() +
                  i18n.t("continue").slice(1)
              }
            </ButtonText>
          )}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
export default PhoneNumberScreen;
