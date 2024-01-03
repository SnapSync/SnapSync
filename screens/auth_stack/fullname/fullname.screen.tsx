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
  InputSlot,
  InputIcon,
  CheckIcon,
  Icon,
  Spinner,
} from "@gluestack-ui/themed";
import { Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { AuthStackScreenProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { updateFullname } from "@/redux/features/authentication/authenticationSlice";
import i18n from "@/lang";
import { ValidateFullname } from "@/api/routes/auth.routes";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import {
  FULLNAME_MAX_LENGTH,
  FULLNAME_MIN_LENGTH,
  FULLNAME_REGEX,
} from "@/costants/Validation";
import { isErrorResponse } from "@/api/api_responses.types";
import { Verified } from "lucide-react-native";

const FullNameScreen = ({ navigation }: AuthStackScreenProps<"FullName">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const toast = useToast();

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
    onError: (error) => {
      let message = i18n.t("errors.generic");

      if (error && isErrorResponse(error) && error.statusCode === 422) {
        message = i18n.t("errors.fullname.invalid");
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

  const _handleChangeText = (text: string) => {
    dispatch(updateFullname(text));
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

    // Controllo se il nome e cognome inserito è valido
    if (!authDto.fullName) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.fullname.required")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (authDto.fullName.length < FULLNAME_MIN_LENGTH) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.fullname.minLength", {
                    minLength: FULLNAME_MIN_LENGTH,
                  })}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (authDto.fullName.length > FULLNAME_MAX_LENGTH) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.fullname.maxLength", {
                    maxLength: FULLNAME_MAX_LENGTH,
                  })}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (!FULLNAME_REGEX.test(authDto.fullName)) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.fullname.regex")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    // Faccio la chiamata al backend per validare il nome e cognome inserito
    validateFullnameMutation.mutate({
      fullname: authDto.fullName,
      sessionId: authDto.sessionId,
    });
  };

  return (
    <KeyboardAvoidingView
      paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
      paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
      paddingTop={insets.top}
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      bgColor="transparent"
      alignItems="center"
    >
      <TopSection title={i18n.t("fullnameScreen.topSectionTitle")}>
        <FormControl
          isDisabled={validateFullnameMutation.isPending}
          width="100%"
        >
          <Input borderWidth={0} height="$10">
            <InputField
              onChangeText={_handleChangeText}
              value={authDto.fullName}
              placeholder={i18n.t("fullnameScreen.inputPlaceholder")}
              autoFocus={true}
              autoComplete="name"
              maxLength={FULLNAME_MAX_LENGTH}
              keyboardAppearance={colorMode === "dark" ? "dark" : "light"}
              onSubmitEditing={_onPress}
              fontFamily="Inter_900Black"
              size="3xl"
              alignSelf="center"
              textAlign="center"
              autoCapitalize="words"
            />
          </Input>
        </FormControl>
      </TopSection>
      <BottomSection
        onPress={_onPress}
        isLoading={validateFullnameMutation.isPending}
        isDisabled={
          validateFullnameMutation.isPending ||
          !authDto.fullName ||
          authDto.fullName.length < FULLNAME_MIN_LENGTH ||
          authDto.fullName.length > FULLNAME_MAX_LENGTH ||
          !FULLNAME_REGEX.test(authDto.fullName)
        }
      />
    </KeyboardAvoidingView>
  );
};
export default FullNameScreen;
