import {
  Button,
  ButtonText,
  useColorMode,
  Text,
  KeyboardAvoidingView,
  Input,
  InputField,
  View,
  ButtonSpinner,
  useToast,
  Toast,
  VStack,
  ToastDescription,
  ToastTitle,
} from "@gluestack-ui/themed";
import { Keyboard, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import styles from "../auth.styles";
import { dateOfBirthStyles } from "./date_of_birth.styles";
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
import ErrorText from "@/components/error_text/error_text.component";
import { instanceOfErrorResponseType } from "@/api";
import { isValidDate } from "@/utils/helper";
import { AuthDateOfBirthMinAge } from "../auth.costants";
import { useConnectivity } from "@/hooks/useConnectivity";

const DateOfBirthScreen = ({
  navigation,
  route,
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
      deviceUuid: string;
    }) =>
      ValidateDateOfBirth(
        data.sessionId,
        data.yearOfBirth,
        data.monthOfBirth,
        data.dayOfBirth,
        data.deviceUuid
      ),
    onSuccess: () => {
      navigation.navigate("PhoneNumber", {
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

  const _handleChangeMonthOfBirth = (value: string) => {
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
      if (value.length === 2) inputRefDayOfBirth.current?.focus();
    }
  };

  const _handleChangeDayOfBirth = (value: string) => {
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

      // Se la lunghezza è 2, passo all'anno
      if (value.length === 2) inputRefYearOfBirth.current?.focus();
    }
  };

  const _handleChangeYearOfBirth = (value: string) => {
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

  const _handlePressContinue = () => {
    Keyboard.dismiss();

    if (!isConnected) {
      // Mostro il toast e riprovo a connettermi
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
      i18n.t("fields.dateOfBirth").charAt(0).toUpperCase() +
      i18n.t("fields.dateOfBirth").slice(1);
    let errorMessage: string | null = null;

    if (authDto.dayOfBirth === null) {
      field =
        i18n.t("fields.dayOfBirth").charAt(0).toUpperCase() +
        i18n.t("fields.dayOfBirth").slice(1);
      errorMessage = i18n.t("errors.required", {
        field: field,
      });
    }

    if (authDto.monthOfBirth === null) {
      field =
        i18n.t("fields.monthOfBirth").charAt(0).toUpperCase() +
        i18n.t("fields.monthOfBirth").slice(1);
      errorMessage = i18n.t("errors.required", {
        field: field,
      });
    }

    if (authDto.yearOfBirth === null) {
      field =
        i18n.t("fields.yearOfBirth").charAt(0).toUpperCase() +
        i18n.t("fields.yearOfBirth").slice(1);
      errorMessage = i18n.t("errors.required", {
        field: field,
      });
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
      authDto.dayOfBirth &&
      authDto.monthOfBirth &&
      authDto.yearOfBirth
    ) {
      // Verifico se la data di nascita è valida
      let isValid = isValidDate(
        authDto.yearOfBirth,
        authDto.monthOfBirth,
        authDto.dayOfBirth
      );
      if (!isValid) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={"toast-" + id} action="error" variant="accent">
                <VStack space="xs">
                  <ToastTitle>
                    {i18n.t("errors.unprocessableEntityTitle")}
                  </ToastTitle>
                  <ToastDescription>
                    {i18n.t("errors.invalid", {
                      field:
                        i18n.t("fields.dateOfBirth").charAt(0).toUpperCase() +
                        i18n.t("fields.dateOfBirth").slice(1),
                    })}
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
        return;
      }

      // Controllo se ha l'eta minima
      let hasMinAge =
        new Date().getFullYear() - authDto.yearOfBirth >= AuthDateOfBirthMinAge;
      if (!hasMinAge) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={"toast-" + id} action="error" variant="accent">
                <VStack space="xs">
                  <ToastTitle>
                    {i18n.t("errors.unprocessableEntityTitle")}
                  </ToastTitle>
                  <ToastDescription>
                    {i18n.t("errors.minAge", {
                      minAge: AuthDateOfBirthMinAge,
                    })}
                  </ToastDescription>
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
            {i18n.t("auth.dateOfBirth.title", {
              fullName: authDto.fullName,
            })}
          </Text>
          <Text
            style={styles.textSubTitle}
            color={colorMode === "light" ? "$textLight700" : "$textDark400"}
          >
            {i18n.t("auth.dateOfBirth.subtitle")}
          </Text>
        </View>
        <View style={dateOfBirthStyles.viewDateOfBirth}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Input
              size={"sm"}
              variant={"underlined"}
              isInvalid={false}
              isDisabled={false}
              isRequired={true}
            >
              <InputField
                placeholder="MM"
                autoFocus={true}
                maxLength={2}
                keyboardType="number-pad"
                value={
                  authDto.monthOfBirth
                    ? authDto.monthOfBirth.toString()
                    : undefined
                }
                ref={inputRefMonthOfBirth}
                onChangeText={_handleChangeMonthOfBirth}
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                autoComplete={
                  Platform.OS === "android" ? "birthdate-month" : undefined
                }
              />
            </Input>
          </View>
          <Text
            style={dateOfBirthStyles.textSlash}
            color={
              colorMode === "light"
                ? "$backgroundLight300"
                : "$backgroundLight700"
            }
          >
            /
          </Text>
          <View
            style={{
              flex: 1,
            }}
          >
            <Input
              size={"sm"}
              variant={"underlined"}
              isInvalid={false}
              isDisabled={false}
              isRequired={true}
            >
              <InputField
                placeholder="DD"
                maxLength={2}
                keyboardType="number-pad"
                ref={inputRefDayOfBirth}
                onChangeText={_handleChangeDayOfBirth}
                value={
                  authDto.dayOfBirth ? authDto.dayOfBirth.toString() : undefined
                }
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                autoComplete={
                  Platform.OS === "android" ? "birthdate-day" : undefined
                }
              />
            </Input>
          </View>
          <Text
            style={dateOfBirthStyles.textSlash}
            color={
              colorMode === "light"
                ? "$backgroundLight300"
                : "$backgroundLight700"
            }
          >
            /
          </Text>
          <View
            style={{
              flex: 1,
            }}
          >
            <Input
              size={"sm"}
              variant={"underlined"}
              isInvalid={false}
              isDisabled={false}
              isRequired={true}
            >
              <InputField
                placeholder="YYYY"
                maxLength={4}
                keyboardType="number-pad"
                ref={inputRefYearOfBirth}
                onChangeText={_handleChangeYearOfBirth}
                value={
                  authDto.yearOfBirth
                    ? authDto.yearOfBirth.toString()
                    : undefined
                }
                keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                selectionColor={colorMode === "dark" ? "white" : "black"}
                autoComplete={
                  Platform.OS === "android" ? "birthdate-year" : undefined
                }
              />
            </Input>
          </View>
        </View>
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
            authDto.monthOfBirth === null ||
            authDto.dayOfBirth === null ||
            authDto.yearOfBirth === null ||
            validateDateOfBirthMutation.isPending
          }
          onPress={_handlePressContinue}
        >
          {validateDateOfBirthMutation.isPending ? (
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

export default DateOfBirthScreen;
