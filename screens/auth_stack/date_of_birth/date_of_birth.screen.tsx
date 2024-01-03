import {
  useColorMode,
  KeyboardAvoidingView,
  Input,
  InputField,
  useToast,
  Toast,
  VStack,
  ToastDescription,
  FormControl,
} from "@gluestack-ui/themed";
import { Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
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
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import TopSection from "@/components/auth/top_section/top_section.component";
import { MIN_AGE } from "./date_of_birth.costants";
import moment from "moment";
import { isErrorResponse } from "@/api/api_responses.types";
import SnapSyncErrors from "@/api/api_errors";

const DateOfBirthScreen = ({
  navigation,
}: AuthStackScreenProps<"DateOfBirth">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const toast = useToast();

  const inputRefMonthOfBirth = React.useRef<any>(null);
  const inputRefDayOfBirth = React.useRef<any>(null);
  const inputRefYearOfBirth = React.useRef<any>(null);

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const [format, setFormat] = React.useState<string[]>(["DD", "MM", "YYYY"]);

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
    onError: (error) => {
      let message = i18n.t("errors.generic");

      if (error && isErrorResponse(error) && error.statusCode === 422) {
        if (error.type === SnapSyncErrors.SnapSyncMinAgeError) {
          message = i18n.t("errors.dateOfBirth.ageNotValid", {
            minAge: MIN_AGE,
          });
        } else {
          message = i18n.t("errors.dateOfBirth.invalid");
        }
      }

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

  React.useEffect(() => {
    const formatObj = new Intl.DateTimeFormat(i18n.locale).formatToParts(
      new Date()
    );

    const strFormat = formatObj
      .map((obj) => {
        switch (obj.type) {
          case "day":
            return "DD";
          case "month":
            return "MM";
          case "year":
            return "YYYY";
          default:
            return obj.value;
        }
      })
      .filter((f) => f !== "/");

    setFormat(strFormat);
  }, [i18n.locale]);

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

  const _onPress = () => {
    // Nel caso in cui il sessionId non è stato recuperato dal backend mostro un toast con un errore
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

    if (!authDto.monthOfBirth) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.monthRequired")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (!authDto.dayOfBirth) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.dayRequired")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (!authDto.yearOfBirth) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.yearRequired")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Controllo che il mese sia compreso tra 1 e 12
    if (authDto.monthOfBirth < 1 || authDto.monthOfBirth > 12) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.monthInvalid")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Controllo che il giorno sia compreso tra 1 e 31
    if (authDto.dayOfBirth < 1 || authDto.dayOfBirth > 31) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.dayInvalid")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Controllo che l'anno sia compreso tra 1900 e l'anno corrente
    if (
      authDto.yearOfBirth < 1900 ||
      authDto.yearOfBirth > new Date().getFullYear()
    ) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.yearInvalid")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Controllo che la data di nascita sia valida
    if (
      !moment(
        `${authDto.yearOfBirth}-${authDto.monthOfBirth}-${authDto.dayOfBirth}`,
        "YYYY-MM-DD"
      ).isValid()
    ) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.invalid")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Controllo che l'utente abbia almeno MIN_AGE anni
    if (
      moment(
        `${authDto.yearOfBirth}-${authDto.monthOfBirth}-${authDto.dayOfBirth}`,
        "YYYY-MM-DD"
      ).isAfter(moment().subtract(MIN_AGE, "years"))
    ) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.dateOfBirth.ageNotValid", {
                    minAge: MIN_AGE,
                  })}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Chiamo il backend
    validateDateOfBirthMutation.mutate({
      dayOfBirth: authDto.dayOfBirth,
      monthOfBirth: authDto.monthOfBirth,
      yearOfBirth: authDto.yearOfBirth,
      sessionId: authDto.sessionId,
    });
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
        title={i18n.t("dateOfBirthScreen.topSectionTitle", {
          fullname: authDto.fullName,
        })}
      >
        <FormControl
          width="100%"
          isDisabled={validateDateOfBirthMutation.isPending}
          flexDirection="row"
        >
          {format.map((f, index) => {
            return (
              <Input
                borderWidth={0}
                height="$10"
                width={f === "YYYY" ? "50%" : "25%"}
                key={index}
              >
                <InputField
                  placeholder={
                    f === "YYYY"
                      ? i18n.t("dateOfBirthScreen.yearPlaceholder")
                      : f === "MM"
                      ? i18n.t("dateOfBirthScreen.monthPlaceholder")
                      : i18n.t("dateOfBirthScreen.dayPlaceholder")
                  }
                  maxLength={f === "YYYY" ? 4 : 2}
                  autoFocus={index === 0}
                  keyboardType="number-pad"
                  ref={
                    f === "YYYY"
                      ? inputRefYearOfBirth
                      : f === "MM"
                      ? inputRefMonthOfBirth
                      : inputRefDayOfBirth
                  }
                  onChangeText={
                    f === "YYYY"
                      ? onChangeTextYearOfBirth
                      : f === "MM"
                      ? onChangeTextMonthOfBirth
                      : onChangeTextDayOfBirth
                  }
                  value={
                    f === "YYYY"
                      ? authDto.yearOfBirth?.toString()
                      : f === "MM"
                      ? authDto.monthOfBirth?.toString()
                      : authDto.dayOfBirth?.toString()
                  }
                  keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                  fontFamily="Inter_900Black"
                  size="3xl"
                  textAlign="center"
                />
              </Input>
            );
          })}
        </FormControl>
      </TopSection>
      <BottomSection
        onPress={_onPress}
        isLoading={validateDateOfBirthMutation.isPending}
        isDisabled={
          !authDto.monthOfBirth ||
          !authDto.dayOfBirth ||
          !authDto.yearOfBirth ||
          authDto.monthOfBirth < 1 ||
          authDto.monthOfBirth > 12 ||
          authDto.dayOfBirth < 1 ||
          authDto.dayOfBirth > 31 ||
          authDto.yearOfBirth < 1900 ||
          authDto.yearOfBirth > new Date().getFullYear() ||
          !moment(
            `${authDto.yearOfBirth}-${authDto.monthOfBirth}-${authDto.dayOfBirth}`,
            "YYYY-MM-DD"
          ).isValid() ||
          moment(
            `${authDto.yearOfBirth}-${authDto.monthOfBirth}-${authDto.dayOfBirth}`,
            "YYYY-MM-DD"
          ).isAfter(moment().subtract(MIN_AGE, "years")) ||
          validateDateOfBirthMutation.isPending
        }
      />
    </KeyboardAvoidingView>
  );
};

export default DateOfBirthScreen;
