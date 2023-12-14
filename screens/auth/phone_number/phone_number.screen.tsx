import {
  useColorMode,
  KeyboardAvoidingView,
  View,
  useToast,
  Toast,
  VStack,
  Text,
  ToastDescription,
  Input,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
  Pressable,
} from "@gluestack-ui/themed";
import { Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { AuthStackScreenProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import i18n from "@/lang";
import { updatePhoneNumber } from "@/redux/features/authentication/authenticationSlice";
import { useMutation } from "@tanstack/react-query";
import { ValidatePhoneNumber } from "@/api/routes/auth.routes";
import { instanceOfErrorResponseType } from "@/api";
import { useConnectivity } from "@/hooks/useConnectivity";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import { PhoneNumberUtil } from "google-libphonenumber";
import { getNationalNumber, isValidPhoneNumber } from "./phone_number.utils";

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
  });

  React.useEffect(() => {
    // Non faccio tornare indietro l'utente
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      return;
    });
  }, [navigation]);

  const _onChangeText = (text: string) => {
    // Recupero il getNationalNumber
    let nationNumber = getNationalNumber(text);
    let isValidNumber = isValidPhoneNumber(text);

    // Se il numero di telefono è valido, per quel prefisso,nel input non mostro il prefisso, ma solo il numero
    if (nationNumber !== null && nationNumber !== undefined && isValidNumber) {
      dispatch(updatePhoneNumber(nationNumber.toString()));
    } else {
      dispatch(updatePhoneNumber(text));
    }
  };

  const _onPress = () => {
    // Keyboard.dismiss();

    if (
      !authDto.phoneNumberCountry ||
      !authDto.phoneNumber ||
      !authDto.sessionId
    ) {
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
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      paddingTop={insets.top}
      flex={1}
    >
      <TopSection title={i18n.t("auth.phoneNumber.title")}>
        <FormControl
          isInvalid={validatePhoneNumberMutation.isError}
          width={"100%"}
          // Prima di iniziare a scrivere il numero di telefono, l'utente deve aver selezionato il prefisso
          isDisabled={
            validatePhoneNumberMutation.isPending || !authDto.phoneNumberCountry
          }
        >
          <View
            backgroundColor="transparent"
            // gap={4}
            width={"100%"}
            flexDirection="row"
            alignItems="center"
          >
            <Pressable
              alignItems="center"
              justifyContent="center"
              // padding="$1"
              borderRadius="$2xl"
              borderWidth={1}
              flexDirection="row"
              gap="$1"
              backgroundColor="transparent"
              height={55}
              width={75}
              borderColor={
                colorMode === "dark" ? "$borderDark700" : "$borderLight200"
              }
              disabled={validatePhoneNumberMutation.isPending}
              onPress={navigateToCountryPicker}
            >
              {authDto.phoneNumberCountry && (
                <Text fontSize="$sm" lineHeight="$sm">
                  {authDto.phoneNumberCountry.flag}
                </Text>
              )}
              {authDto.phoneNumberCountry && (
                <Text
                  size="sm"
                  fontFamily="Inter_900Black"
                >{`+${authDto.phoneNumberCountry.countryCallingCode}`}</Text>
              )}
            </Pressable>
            <Input borderWidth={0} height={70} flex={1}>
              <InputField
                keyboardType="phone-pad"
                placeholder={i18n.t("auth.phoneNumber.placeholder")}
                autoFocus={authDto.phoneNumberCountry ? true : false}
                autoComplete="tel"
                onChangeText={_onChangeText}
                value={authDto.phoneNumber}
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                fontFamily="Inter_900Black"
                size="3xl"
              />
            </Input>
          </View>
          {validatePhoneNumberMutation.isError && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText flexShrink={1}>
                {validatePhoneNumberMutation.error &&
                instanceOfErrorResponseType(
                  validatePhoneNumberMutation.error
                ) &&
                validatePhoneNumberMutation.error.statusCode === 422
                  ? i18n.t("errors.fieldNotValid")
                  : i18n.t("errors.generic")}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </TopSection>

      <BottomSection
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
        hint={i18n.t("auth.privacyPolicyHint")}
      />
    </KeyboardAvoidingView>
  );
};
export default PhoneNumberScreen;
