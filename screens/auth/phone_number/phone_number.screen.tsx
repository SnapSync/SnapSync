import {
  useColorMode,
  KeyboardAvoidingView,
  View,
  useToast,
  Toast,
  VStack,
  ToastTitle,
  Text,
  ToastDescription,
  Input,
  InputField,
  FormControl,
} from "@gluestack-ui/themed";
import { Keyboard, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { AuthStackScreenProps } from "@/types";
import styles from "../auth.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import i18n from "@/lang";
import ErrorText from "@/components/error_text/error_text.component";
import phoneNumberStyles from "./phone_number.styles";
import { updatePhoneNumber } from "@/redux/features/authentication/authenticationSlice";
import { useMutation } from "@tanstack/react-query";
import { ValidatePhoneNumber } from "@/api/routes/auth.routes";
import { instanceOfErrorResponseType } from "@/api";
import { useConnectivity } from "@/hooks/useConnectivity";
import authStyles from "../auth.styles";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneNumberUtil = PhoneNumberUtil.getInstance();

const PhoneNumberScreen = ({
  navigation,
}: AuthStackScreenProps<"PhoneNumber">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const toast = useToast();

  const { isConnected } = useConnectivity();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const validatePhoneNumberMutation = useMutation({
    mutationFn: (data: { phoneNumber: string; sessionId: string }) =>
      ValidatePhoneNumber(data.sessionId, data.phoneNumber),
    onSuccess: () => {
      navigation.navigate("Otp");
    },
    onError: (error) => {
      let message = i18n.t("errors.generic");
      let title: string | null = null;

      if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 422
      ) {
        message = i18n.t("errors.invalid", {
          field:
            i18n.t("fields.phoneNumber").charAt(0).toUpperCase() +
            i18n.t("fields.phoneNumber").slice(1),
        });
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

  const _onTouchStart = () => {
    Keyboard.dismiss();
  };

  const _onChangeText = (text: string) => {
    if (
      text.startsWith("+") &&
      isValidNumber(text, authDto.phoneNumberCountry?.countryCode)
    ) {
      const countryDialCode = getCountryCode(text);
      if (countryDialCode) {
        // Rimuovo il dial code dal numero di telefono
        text = text.replace(`+${countryDialCode}`, "").trimStart();
      }
    }

    dispatch(updatePhoneNumber(text));
  };

  const _onPress = () => {
    Keyboard.dismiss();

    if (!isConnected) {
      // Mostro il toast, perchè l'utente si è disconnesso
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

    if (!authDto.phoneNumberCountry || !authDto.phoneNumber) return;

    // Formatto il numero di telefono
    const phoneNumberFormatted = formatE164(
      authDto.phoneNumber,
      authDto.phoneNumberCountry.countryCode
    );

    validatePhoneNumberMutation.mutate({
      phoneNumber: phoneNumberFormatted,
      sessionId: authDto.sessionId,
    });
  };

  const navigateToCountryPicker = () => {
    navigation.navigate("CountryList");
  };

  const isValidNumber = (number: string, countryCode?: string): boolean => {
    try {
      const phoneNumber = phoneNumberUtil.parse(number, countryCode);
      return phoneNumberUtil.isValidNumber(phoneNumber);
    } catch (error) {
      return false;
    }
  };

  const getCountryCode = (
    number: string,
    countryCode?: string
  ): number | undefined => {
    try {
      const phoneNumber = phoneNumberUtil.parse(number);
      const dialCode = phoneNumber.getCountryCode();

      return dialCode;
    } catch (e) {
      return undefined;
    }
  };

  const formatE164 = (number: string, countryCode?: string): string => {
    try {
      const phoneNumber = phoneNumberUtil.parse(number, countryCode);
      return phoneNumberUtil.format(phoneNumber, 1);
    } catch (error) {
      return number;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
        paddingRight: insets.right + Layout.DefaultMarginHorizontal,
        flexDirection: "column",
      }}
      onTouchStart={_onTouchStart}
      bgColor={
        colorMode === "light" ? "$backgroundLight0" : "$backgroundDark950"
      }
    >
      <View style={styles.header}>
        <TopSection
          title={i18n.t("auth.phoneNumber.title")}
          withDarkMode={colorMode === "dark"}
        />
        <View style={phoneNumberStyles.viewTextInputContainer}>
          <TouchableOpacity
            style={[
              phoneNumberStyles.viewCountryInfo,
              colorMode === "dark"
                ? phoneNumberStyles.viewCountryInfoDark
                : phoneNumberStyles.viewCountryInfoLight,
            ]}
            disabled={validatePhoneNumberMutation.isPending}
            onPress={navigateToCountryPicker}
          >
            {authDto.phoneNumberCountry && (
              <Text style={[phoneNumberStyles.flagText]}>
                {authDto.phoneNumberCountry.flag}
              </Text>
            )}
            {authDto.phoneNumberCountry && (
              <Text
                style={[phoneNumberStyles.codeText]}
                color={colorMode === "dark" ? "$textDark0" : "$textLight700"}
              >{`+${authDto.phoneNumberCountry.countryCallingCode}`}</Text>
            )}
          </TouchableOpacity>
          <FormControl
            isInvalid={
              validatePhoneNumberMutation.isError &&
              validatePhoneNumberMutation.error &&
              instanceOfErrorResponseType(validatePhoneNumberMutation.error) &&
              validatePhoneNumberMutation.error.statusCode === 422
            }
            width={"100%"}
            // Prima di iniziare a scrivere il numero di telefono, l'utente deve aver selezionato il prefisso
            isDisabled={
              validatePhoneNumberMutation.isPending ||
              !authDto.phoneNumberCountry
            }
          >
            <Input borderWidth={0} height={70}>
              <InputField
                keyboardType="phone-pad"
                placeholder={i18n.t("auth.phoneNumber.placeholder")}
                autoFocus={authDto.phoneNumberCountry ? true : false}
                autoComplete="tel"
                onChangeText={_onChangeText}
                value={authDto.phoneNumber}
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                style={[
                  authStyles.input,
                  {
                    textAlign: "left",
                  },
                ]}
              />
            </Input>
          </FormControl>
        </View>
      </View>

      <BottomSection
        buttonLabel={i18n.t("continue")}
        onPress={_onPress}
        isLoading={validatePhoneNumberMutation.isPending}
        isDisabled={
          validatePhoneNumberMutation.isPending ||
          !authDto.phoneNumber ||
          !authDto.phoneNumberCountry ||
          !isValidNumber(
            authDto.phoneNumber,
            authDto.phoneNumberCountry?.countryCode
          )
        }
        pb={insets.bottom === 0 ? 20 : insets.bottom}
        hint={i18n.t("auth.privacyPolicyHint")}
      />
    </KeyboardAvoidingView>
  );
};
export default PhoneNumberScreen;
