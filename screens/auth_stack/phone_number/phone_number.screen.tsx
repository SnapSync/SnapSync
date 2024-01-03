import {
  useColorMode,
  KeyboardAvoidingView,
  useToast,
  Toast,
  VStack,
  ToastDescription,
  Input,
  InputField,
  FormControl,
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
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import {
  formatPhoneNumber,
  getNationalNumber,
  isValidPhoneNumber,
} from "./phone_number.utils";
import PhoneNumberDialCodeButton from "@/components/phone_number_dial_button/phone_number_dial_button.component";

const PhoneNumberScreen = ({
  navigation,
}: AuthStackScreenProps<"PhoneNumber">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const toast = useToast();

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

      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
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
    const phoneNumberFormatted = formatPhoneNumber(
      authDto.phoneNumber,
      authDto.phoneNumberCountry.countryCode
    );

    if (!phoneNumberFormatted) {
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

    validatePhoneNumberMutation.mutate({
      phoneNumber: phoneNumberFormatted,
      sessionId: authDto.sessionId,
    });
  };

  const navigateToCountryPicker = () => {
    navigation.navigate("CountryList");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      paddingTop={insets.top}
      flex={1}
      bgColor="transparent"
      alignItems="center"
    >
      <TopSection title={i18n.t("phoneNumberScreen.topSectionTitle")}>
        <FormControl
          width={"100%"}
          // Prima di iniziare a scrivere il numero di telefono, l'utente deve aver selezionato il prefisso
          isDisabled={
            validatePhoneNumberMutation.isPending || !authDto.phoneNumberCountry
          }
          flexDirection="row"
          alignItems="center"
        >
          <PhoneNumberDialCodeButton
            country={authDto.phoneNumberCountry}
            onPress={navigateToCountryPicker}
            disabled={validatePhoneNumberMutation.isPending}
          />
          <Input borderWidth={0} height="$10" flex={1}>
            <InputField
              keyboardType="phone-pad"
              placeholder={i18n.t("phoneNumberScreen.inputPlaceholder")}
              autoFocus={authDto.phoneNumberCountry ? true : false}
              autoComplete="tel"
              onChangeText={_onChangeText}
              value={authDto.phoneNumber}
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              fontFamily="Inter_900Black"
              size="3xl"
            />
          </Input>
        </FormControl>
      </TopSection>

      <BottomSection
        onPress={_onPress}
        isLoading={validatePhoneNumberMutation.isPending}
        isDisabled={
          validatePhoneNumberMutation.isPending ||
          !authDto.phoneNumber ||
          !authDto.phoneNumberCountry ||
          !isValidPhoneNumber(
            authDto.phoneNumber,
            authDto.phoneNumberCountry?.countryCode
          )
        }
        hint={i18n.t("phoneNumberScreen.hint")}
      />
    </KeyboardAvoidingView>
  );
};
export default PhoneNumberScreen;
