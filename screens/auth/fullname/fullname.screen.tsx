import {
  Button,
  ButtonText,
  useColorMode,
  Text,
  KeyboardAvoidingView,
  Input,
  InputField,
  View,
  Spinner,
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
import { AuthStackScreenProps } from "@/types";
import styles from "../auth.styles";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { DeviceUuidKey } from "@/costants/SecureStoreKeys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RegisterDevice } from "@/api/routes/devices.route";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import {
  updateFullname,
  updatePhoneNumberCountryCode,
  updateSessionId,
} from "@/redux/features/authentication/authenticationSlice";
import i18n from "@/lang";
import { GetSessionId, ValidateFullname } from "@/api/routes/auth.routes";
import {
  AuthFullNameMaxLength,
  AuthFullNameMinLength,
  AuthFullNameRegex,
} from "../auth.costants";
import ErrorText from "@/components/error_text/error_text.component";
import { instanceOfErrorResponseType } from "@/api";
import * as Localization from "expo-localization";
import { useIsFirstRender } from "usehooks-ts";
import { useConnectivity } from "@/hooks/useConnectivity";
import { setDeviceUuid } from "@/redux/features/app/appSlice";
import * as Device from "expo-device";

const FullNameScreen = ({ navigation }: AuthStackScreenProps<"FullName">) => {
  const toast = useToast();

  const isFirst = useIsFirstRender();

  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const { isConnected } = useConnectivity();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  // const registerDeviceMutation = useMutation({
  //   mutationFn: (data: { os: string; type: string }) =>
  //     RegisterDevice(data.os, data.type),
  //   onSuccess: async (data) => {
  //     await SecureStore.setItemAsync(DeviceUuidKey, data.device.uuid);
  //     dispatch(setDeviceUuid(data.device.uuid));
  //   },
  // });

  const validateFullnameMutation = useMutation({
    mutationFn: (data: { fullname: string; sessionId: string }) =>
      ValidateFullname(data.fullname, data.sessionId),
    onSuccess: () => {
      navigation.navigate("DateOfBirth");
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
            i18n.t("fields.fullname").charAt(0).toUpperCase() +
            i18n.t("fields.fullname").slice(1),
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

  const {
    data,
    isLoading: isLoadingSessionId,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: () => GetSessionId(),
    enabled: false,
  });

  React.useEffect(() => {
    if (data && data.sessionId) {
      dispatch(updateSessionId(data.sessionId));
    }
  }, [data]);

  React.useEffect(() => {
    if (!authDto.phoneNumberCountryCode && Localization.locale) {
      let locales = Localization.getLocales();
      if (locales.length > 0) {
        dispatch(
          updatePhoneNumberCountryCode(locales[0].languageCode.toUpperCase())
        );
      }
    }
  }, [authDto.phoneNumberCountryCode, dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (isConnected) {
        refetch();
      }
    }, [isConnected])
  );

  // const _getDeviceUuid = async () => {
  //   let result = await SecureStore.getItemAsync(DeviceUuidKey);
  //   if (result) {
  //     refModeRetriveDeviceUuid.current = "SucureStore";
  //     dispatch(setDeviceUuid(result));
  //   } else if (isConnected) {
  //     refModeRetriveDeviceUuid.current = "RegisterDevice";
  //     // Registro un nuovo dispositivo

  //     // TODO: Mappare il tipo di dispositivo
  //     let dt = await Device.getDeviceTypeAsync();

  //     registerDeviceMutation.mutate({
  //       os: Platform.OS,
  //       type: "UNKNOWN",
  //     });
  //   }
  // };

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _handleChangeText = (text: string) => {
    dispatch(updateFullname(text));
  };

  const _handlePressContinue = () => {
    Keyboard.dismiss();

    // Il primo carattere deve essere maiuscolo
    let field =
      i18n.t("fields.fullname").charAt(0).toUpperCase() +
      i18n.t("fields.fullname").slice(1);

    let errorMessage: string | null = null;

    if (!authDto.fullName) {
      errorMessage = i18n.t("errors.required", {
        field: field,
      });
    } else {
      // Controllo la lunghezza
      if (authDto.fullName.length < AuthFullNameMinLength) {
        errorMessage = i18n.t("errors.minLenght", {
          field: field,
          minLenght: AuthFullNameMinLength,
        });
      }

      if (authDto.fullName.length > AuthFullNameMaxLength) {
        errorMessage = i18n.t("errors.maxLenght", {
          field: field,
          maxLenght: AuthFullNameMaxLength,
        });
      }

      // Controllo il regex
      if (!AuthFullNameRegex.test(authDto.fullName)) {
        errorMessage = i18n.t("errors.regex", {
          field: field,
        });
      }
    }

    if (errorMessage && errorMessage.length > 0) {
      // Mostro il toast
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

    if (authDto.fullName && data && data.sessionId) {
      validateFullnameMutation.mutate({
        fullname: authDto.fullName,
        sessionId: data.sessionId,
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

  if (isConnected === false) {
    // if (isLoading) {
    //   return (
    //     <View
    //       style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //     >
    //       <Spinner size="small" />
    //     </View>
    //   );
    // }

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ErrorText
          message={i18n.t("errors.noInternetConnection")}
          style={{
            fontSize: 12,
          }}
        />
      </View>
    );
  }

  // if (!deviceUuid) {
  //   if (registerDeviceMutation.isPending) {
  //     return (
  //       <View
  //         style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //       >
  //         <Spinner size="small" />
  //       </View>
  //     );
  //   }

  //   if (
  //     !registerDeviceMutation.data &&
  //     refModeRetriveDeviceUuid.current === "RegisterDevice"
  //   ) {
  //     return (
  //       <View
  //         style={{
  //           flex: 1,
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <ErrorText message={i18n.t("errors.deviceNotFound")} />
  //       </View>
  //     );
  //   }
  // }

  if (!data) {
    if (isLoadingSessionId) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size="small" />
        </View>
      );
    }

    if (isError) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ErrorText message={i18n.t("errors.generic")} />
        </View>
      );
    }
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
            {i18n.t("auth.fullname.title")}
          </Text>
          <Text
            style={styles.textSubTitle}
            color={colorMode === "light" ? "$textLight700" : "$textDark400"}
          >
            {i18n.t("auth.fullname.subtitle")}
          </Text>
        </View>
        <Input
          size={"sm"}
          variant={"underlined"}
          isInvalid={false}
          isDisabled={false}
          isRequired={true}
        >
          <InputField
            onChangeText={_handleChangeText}
            value={authDto.fullName}
            // placeholder="Nome..."
            autoFocus={true}
            autoComplete="name"
            maxLength={AuthFullNameMaxLength}
            keyboardAppearance={colorMode === "light" ? "light" : "dark"}
            selectionColor={colorMode === "dark" ? "white" : "black"}
            keyboardType={
              Platform.OS === "ios" ? "ascii-capable" : "visible-password"
            } // Diabilito il bottone per le emoji
            style={{
              fontWeight: "700",
              fontFamily: "Inter-Bold",
            }}
          />
        </Input>
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
            !authDto.fullName ||
            authDto.fullName.length < AuthFullNameMinLength ||
            authDto.fullName.length > AuthFullNameMaxLength ||
            !AuthFullNameRegex.test(authDto.fullName) ||
            validateFullnameMutation.isPending
          }
          borderRadius={14}
          width={"100%"}
          onPress={_handlePressContinue}
        >
          {validateFullnameMutation.isPending ? (
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
export default FullNameScreen;
