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
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
  InputSlot,
  InputIcon,
  Spinner,
  CheckIcon,
  Icon,
} from "@gluestack-ui/themed";
import { Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { AuthStackScreenProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import {
  resetAuthDto,
  updateUsername,
} from "@/redux/features/authentication/authenticationSlice";
import i18n from "@/lang";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignUp, ValidateUsername } from "@/api/routes/auth.routes";
import { login } from "@/redux/features/auth/authSlice";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "@/costants/Validation";
import AuthKeys from "../auth.keys";
// import { identifyDevice } from "vexo-analytics";
import { isErrorResponse } from "@/api/api_responses.types";

const UsernameScreen = ({}: AuthStackScreenProps<"Username">) => {
  const toast = useToast();

  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const queryClient = useQueryClient();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  // const validateUsernameMutation = useMutation({
  //   mutationFn: (data: { username: string; sessionId: string }) =>
  //     ValidateUsername(data.username, data.sessionId),
  // });

  const signupMutation = useMutation({
    mutationFn: (data: { username: string; sessionId: string }) =>
      SignUp(data.username, data.sessionId),
    onSuccess: async (data) => {
      let accessToken = data.data.accessToken;
      await SecureStore.setItemAsync(AuthTokenKey, accessToken); // Salvo il token nello storage per il prossimo login

      // Salvo lo UserId nello storage
      let userId = data.data.userId;
      // await SecureStore.setItemAsync(UserIdKey, userId.toString());

      // Identificatore del dispositivo
      // await identifyDevice(data.data.vexoToken);

      dispatch(resetAuthDto());

      dispatch(login(data.data));

      // Rimuovo la query con key ["session"] in modo da non avere più il sessionId salvato
      queryClient.removeQueries({
        queryKey: AuthKeys.session,
        exact: true,
      });
    },
    onError: (error) => {
      let message = i18n.t("errors.generic");

      if (error && isErrorResponse(error) && error.statusCode === 422) {
        message = i18n.t("errors.invalidData");
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

  // React.useEffect(() => {
  //   if (validateUsernameMutation.isSuccess && authDto.sessionId) {
  //     signupMutation.mutate({
  //       sessionId: authDto.sessionId,
  //     });
  //   }
  // }, [validateUsernameMutation.isSuccess, authDto.sessionId]);

  // React.useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (
  //       authDto.username &&
  //       authDto.sessionId &&
  //       authDto.username.length >= USERNAME_MIN_LENGTH &&
  //       USERNAME_REGEX.test(authDto.username) &&
  //       authDto.username.length <= USERNAME_MAX_LENGTH
  //     ) {
  //       validateUsernameMutation.mutate({
  //         username: authDto.username,
  //         sessionId: authDto.sessionId,
  //       }); // Chiamo la mutation per validare il fullname
  //     }
  //   }, 1000);

  //   return () => {
  //     clearTimeout(delayDebounceFn);
  //   };
  // }, [authDto]);

  const _saveAuthToken = async (token: string) => {
    await SecureStore.setItemAsync(AuthTokenKey, token);
  };

  // const _saveUserId = async (userId: string) => {
  //   await SecureStore.setItemAsync(UserIdKey, userId);
  // };

  const _onChangeText = (text: string) => {
    // validateUsernameMutation.reset(); // Resetto la mutation per validare il fullname

    dispatch(updateUsername(text.toLocaleLowerCase().trim()));
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

    if (!authDto.username) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.username.required")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (authDto.username.length < USERNAME_MIN_LENGTH) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.username.minLength", {
                    minLength: USERNAME_MIN_LENGTH,
                  })}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (authDto.username.length > USERNAME_MAX_LENGTH) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.username.maxLength", {
                    maxLength: USERNAME_MAX_LENGTH,
                  })}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    if (!USERNAME_REGEX.test(authDto.username)) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>
                  {i18n.t("errors.username.regex")}
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });

      return;
    }

    signupMutation.mutate({
      username: authDto.username,
      sessionId: authDto.sessionId,
    });
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
      <TopSection title={i18n.t("usernameScreen.topSectionTitle")}>
        <FormControl
          width={"100%"}
          isDisabled={signupMutation.isPending}
          isInvalid={
            signupMutation.isError &&
            signupMutation.error &&
            isErrorResponse(signupMutation.error) &&
            signupMutation.error.statusCode === 409
          }
        >
          <Input borderWidth={0} height="$10">
            <InputField
              onChangeText={_onChangeText}
              value={authDto.username}
              placeholder={i18n.t("usernameScreen.inputPlaceholder")}
              autoFocus={true}
              maxLength={USERNAME_MAX_LENGTH}
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              // selectionColor={colorMode === "dark" ? "white" : "black"}
              autoCapitalize="none"
              returnKeyType="done"
              // onSubmitEditing={_onPress}
              fontFamily="Inter_900Black"
              size="3xl"
              textAlign="center"
            />
          </Input>
          {signupMutation.isError &&
            signupMutation.error &&
            isErrorResponse(signupMutation.error) &&
            signupMutation.error.statusCode === 409 && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
                <FormControlErrorText flexShrink={1}>
                  {signupMutation.error.fields?.includes("username")
                    ? i18n.t("errors.usernameAlreadyExists")
                    : signupMutation.error.fields?.includes("phoneNumber")
                    ? i18n.t("errors.phoneNumberAlreadyExists")
                    : i18n.t("errors.generic")}
                </FormControlErrorText>
              </FormControlError>
            )}
        </FormControl>
      </TopSection>
      <BottomSection
        onPress={_onPress}
        isLoading={signupMutation.isPending}
        isDisabled={
          signupMutation.isPending ||
          !authDto.username ||
          authDto.username.length < USERNAME_MIN_LENGTH ||
          authDto.username.length > USERNAME_MAX_LENGTH ||
          !USERNAME_REGEX.test(authDto.username)
        }
        hint={i18n.t("usernameScreen.hint")}
      />
    </KeyboardAvoidingView>
  );
};
export default UsernameScreen;
