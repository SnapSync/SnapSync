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
  ToastTitle,
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
import { AuthStackScreenProps } from "@/types";
import styles from "../auth.styles";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { updateFullname } from "@/redux/features/authentication/authenticationSlice";
import i18n from "@/lang";
import { ValidateFullname } from "@/api/routes/auth.routes";
import { instanceOfErrorResponseType } from "@/api";
import { useConnectivity } from "@/hooks/useConnectivity";
import authStyles from "../auth.styles";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import {
  FULLNAME_MAX_LENGTH,
  FULLNAME_MIN_LENGTH,
  FULLNAME_REGEX,
} from "./fullname.costants";

const FullNameScreen = ({ navigation }: AuthStackScreenProps<"FullName">) => {
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const { isConnected } = useConnectivity();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const validateFullnameMutation = useMutation({
    mutationFn: (data: { fullname: string; sessionId: string }) =>
      ValidateFullname(data.fullname, data.sessionId),
    onSuccess: () => {
      navigation.navigate("DateOfBirth");
    },
  });

  const _onTouchStart = () => {
    Keyboard.dismiss();
  };

  const _handleChangeText = (text: string) => {
    dispatch(updateFullname(text));
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

    if (!authDto.sessionId || !authDto.fullName) {
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

    validateFullnameMutation.mutate({
      fullname: authDto.fullName,
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
          title={i18n.t("auth.fullname.title")}
          withDarkMode={colorMode === "dark"}
        />
        <FormControl
          isDisabled={validateFullnameMutation.isPending}
          width="100%"
          isInvalid={validateFullnameMutation.isError}
        >
          <Input borderWidth={0} height={70}>
            <InputField
              onChangeText={_handleChangeText}
              value={authDto.fullName}
              placeholder={i18n.t("auth.fullname.placeholder")}
              autoFocus={true}
              autoComplete="name"
              maxLength={FULLNAME_MAX_LENGTH}
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "black"}
              style={authStyles.input}
              onSubmitEditing={_onPress}
            />
          </Input>
          {validateFullnameMutation.isError && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
              <FormControlErrorText style={[authStyles.errorText]}>
                {validateFullnameMutation.error &&
                instanceOfErrorResponseType(validateFullnameMutation.error) &&
                validateFullnameMutation.error.statusCode === 422
                  ? i18n.t("errors.invalid", {
                      field:
                        i18n.t("fields.fullname").charAt(0).toUpperCase() +
                        i18n.t("fields.fullname").slice(1),
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
        isLoading={validateFullnameMutation.isPending}
        isDisabled={
          !authDto.fullName ||
          authDto.fullName.length < FULLNAME_MIN_LENGTH ||
          authDto.fullName.length > FULLNAME_MAX_LENGTH ||
          !FULLNAME_REGEX.test(authDto.fullName) ||
          validateFullnameMutation.isPending
        }
        pb={insets.bottom === 0 ? 20 : insets.bottom}
      />
    </KeyboardAvoidingView>
  );
};
export default FullNameScreen;
