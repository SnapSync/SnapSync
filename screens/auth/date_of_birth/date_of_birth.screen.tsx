import {
  useColorMode,
  KeyboardAvoidingView,
  Input,
  InputField,
  View,
  useToast,
  Toast,
  VStack,
  ToastDescription,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { Keyboard, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import styles from "../auth.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { AuthStackScreenProps } from "@/types";
import {
  updateDayOfBirth,
  updateMonthOfBirth,
  updateYearOfBirth,
} from "@/redux/features/authentication/authenticationSlice";
import i18n from "@/lang";
import { useMutation } from "@tanstack/react-query";
import { ValidateDateOfBirth } from "@/api/routes/auth.routes";
import { instanceOfErrorResponseType } from "@/api";
import { useConnectivity } from "@/hooks/useConnectivity";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import TopSection from "@/components/auth/top_section/top_section.component";
import authStyles from "../auth.styles";
import { MIN_AGE } from "./date_of_birth.costants";
import dateOfBirthStyles from "./date_of_birth.styles";

const DateOfBirthScreen = ({
  navigation,
}: AuthStackScreenProps<"DateOfBirth">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const toast = useToast();

  const { isConnected } = useConnectivity();

  const inputRefMonthOfBirth = React.useRef<any>(null);
  const inputRefDayOfBirth = React.useRef<any>(null);
  const inputRefYearOfBirth = React.useRef<any>(null);

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const validateDateOfBirthMutation = useMutation({
    mutationFn: (data: {
      yearOfBirth: number;
      monthOfBirth: number;
      dayOfBirth: number;
      sessionId: string;
    }) =>
      ValidateDateOfBirth(
        data.sessionId,
        data.yearOfBirth,
        data.monthOfBirth,
        data.dayOfBirth
      ),
    onSuccess: () => {
      navigation.navigate("PhoneNumber");
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

  const onChangeTextMonthOfBirth = (value: string) => {
    if (value.length === 0) {
      dispatch(updateMonthOfBirth(null));
    } else {
      // Controllo che sia un numero
      if (isNaN(Number(value))) {
        return;
      }

      // Controllo che sia un numero compreso tra 1 e 12
      if (Number(value) < 1 || Number(value) > 12) {
        return;
      }

      // Aggiorno lo store
      dispatch(updateMonthOfBirth(Number(value)));

      // Se la lunghezza è 2, passo all'anno
      if (value.length === 2) inputRefYearOfBirth.current?.focus();
    }
  };

  const onChangeTextDayOfBirth = (value: string) => {
    if (value.length === 0) {
      dispatch(updateDayOfBirth(null));
    } else {
      // Controllo che sia un numero
      if (isNaN(Number(value))) {
        return;
      }

      // Controllo che sia un numero compreso tra 1 e 31
      if (Number(value) < 1 || Number(value) > 31) {
        return;
      }

      dispatch(updateDayOfBirth(Number(value)));

      // Se la lunghezza è 2, passo al mese
      if (value.length === 2) inputRefMonthOfBirth.current?.focus();
    }
  };

  const onChangeTextYearOfBirth = (value: string) => {
    if (value.length === 0) {
      dispatch(updateYearOfBirth(null));
    } else {
      // Controllo che sia un numero
      if (isNaN(Number(value))) {
        return;
      }

      if (value.length < 4 && value.length > 0) {
        // Significa che l'utente sta ancora scrivendo l'anno
      } else {
        // Controllo che sia un numero compreso tra 1900 e new Date().getFullYear()
        if (Number(value) < 1900 || Number(value) > new Date().getFullYear()) {
          return;
        }
      }

      dispatch(updateYearOfBirth(Number(value)));
    }
  };

  const onKeyPressMonthOfBirth = (e: any) => {
    const text: string | undefined = authDto.monthOfBirth?.toString();
    const key: string | undefined = e && e.nativeEvent && e.nativeEvent.key;

    if (key === "Backspace" && text && text.length === 1) {
      inputRefDayOfBirth.current?.focus();
    }
  };

  const onKeyPressYearOfBirth = (e: any) => {
    const text: string | undefined = authDto.yearOfBirth?.toString();
    const key: string | undefined = e && e.nativeEvent && e.nativeEvent.key;

    if (key === "Backspace" && text && text.length === 1) {
      inputRefMonthOfBirth.current?.focus();
    }
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

    if (
      !authDto.dayOfBirth ||
      !authDto.monthOfBirth ||
      !authDto.yearOfBirth ||
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

    validateDateOfBirthMutation.mutate({
      dayOfBirth: authDto.dayOfBirth,
      monthOfBirth: authDto.monthOfBirth,
      yearOfBirth: authDto.yearOfBirth,
      sessionId: authDto.sessionId,
    });
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
          title={i18n.t("auth.dateOfBirth.title", {
            fullname: authDto.fullName,
          })}
          withDarkMode={colorMode === "dark"}
        />
        <FormControl
          width="100%"
          isDisabled={validateDateOfBirthMutation.isPending}
          isInvalid={validateDateOfBirthMutation.isError}
        >
          <View style={dateOfBirthStyles.containerInputs}>
            <Input borderWidth={0} height={70} width="25%">
              <InputField
                placeholder="DD"
                maxLength={2}
                autoFocus={true}
                keyboardType="number-pad"
                ref={inputRefDayOfBirth}
                onChangeText={onChangeTextDayOfBirth}
                value={
                  authDto.dayOfBirth ? authDto.dayOfBirth.toString() : undefined
                }
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                style={authStyles.input}
              />
            </Input>
            <Input borderWidth={0} height={70} width="25%">
              <InputField
                placeholder="MM"
                maxLength={2}
                keyboardType="number-pad"
                onKeyPress={onKeyPressMonthOfBirth}
                value={
                  authDto.monthOfBirth
                    ? authDto.monthOfBirth.toString()
                    : undefined
                }
                ref={inputRefMonthOfBirth}
                onChangeText={onChangeTextMonthOfBirth}
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                style={authStyles.input}
              />
            </Input>
            <Input borderWidth={0} height={70} width="50%">
              <InputField
                placeholder="YYYY"
                maxLength={4}
                keyboardType="number-pad"
                ref={inputRefYearOfBirth}
                onChangeText={onChangeTextYearOfBirth}
                onKeyPress={onKeyPressYearOfBirth}
                value={
                  authDto.yearOfBirth
                    ? authDto.yearOfBirth.toString()
                    : undefined
                }
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                style={authStyles.input}
              />
            </Input>
          </View>

          {validateDateOfBirthMutation.isError && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
              <FormControlErrorText style={[authStyles.errorText]}>
                {validateDateOfBirthMutation.error &&
                instanceOfErrorResponseType(
                  validateDateOfBirthMutation.error
                ) &&
                validateDateOfBirthMutation.error.statusCode === 422
                  ? validateDateOfBirthMutation.error.type &&
                    validateDateOfBirthMutation.error.type ===
                      "SnapSyncMinAgeError"
                    ? i18n.t("errors.minAge", {
                        minAge: MIN_AGE,
                      })
                    : i18n.t("errors.invalid", {
                        field:
                          i18n.t("fields.dateOfBirth").charAt(0).toUpperCase() +
                          i18n.t("fields.dateOfBirth").slice(1),
                      })
                  : i18n.t("errors.generic")}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </View>
      <BottomSection
        buttonLabel={
          i18n.t("continue").charAt(0).toUpperCase() +
          i18n.t("continue").slice(1)
        }
        onPress={_onPress}
        isLoading={validateDateOfBirthMutation.isPending}
        isDisabled={
          authDto.monthOfBirth === null ||
          authDto.dayOfBirth === null ||
          authDto.yearOfBirth === null ||
          validateDateOfBirthMutation.isPending
        }
        pb={insets.bottom === 0 ? 20 : insets.bottom}
      />
    </KeyboardAvoidingView>
  );
};

export default DateOfBirthScreen;
