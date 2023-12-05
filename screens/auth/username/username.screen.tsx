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
import { instanceOfErrorResponseType } from "@/api";
import { login } from "@/redux/features/auth/authSlice";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey, UserIdKey } from "@/costants/SecureStoreKeys";
import TopSection from "@/components/auth/top_section/top_section.component";
import BottomSection from "@/components/auth/bottom_section/bottom_section.component";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "./username.costants";
import authKeys from "../queries";

const UsernameScreen = ({}: AuthStackScreenProps<"Username">) => {
  const toast = useToast();

  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const queryClient = useQueryClient();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const validateUsernameMutation = useMutation({
    mutationFn: (data: { username: string; sessionId: string }) =>
      ValidateUsername(data.username, data.sessionId),
  });

  const signupMutation = useMutation({
    mutationFn: (data: { sessionId: string }) => SignUp(data.sessionId),
  });

  React.useEffect(() => {
    if (validateUsernameMutation.isSuccess && authDto.sessionId) {
      signupMutation.mutate({
        sessionId: authDto.sessionId,
      });
    }
  }, [validateUsernameMutation.isSuccess, authDto.sessionId]);

  React.useEffect(() => {
    if (signupMutation.data) {
      let accessToken = signupMutation.data.data.accessToken;
      _saveAuthToken(accessToken); // Mi salvo il token per attivare il login in automatico al prossimo avvio dell'app

      // Mi salvo lo UserId
      let userId = signupMutation.data.data.userId;
      _saveUserId(userId.toString());

      // Resetto il dto in redux
      dispatch(resetAuthDto());

      // Faccio il login
      dispatch(login(signupMutation.data.data));

      // Rimuovo la query con key ["session"] in modo da non avere più il sessionId salvato
      queryClient.removeQueries({
        queryKey: authKeys.session,
        exact: true,
      });
    }
  }, [signupMutation.data, dispatch]);

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _saveAuthToken = async (token: string) => {
    await SecureStore.setItemAsync(AuthTokenKey, token);
  };

  const _saveUserId = async (userId: string) => {
    await SecureStore.setItemAsync(UserIdKey, userId);
  };

  const _onChangeText = (text: string) => {
    dispatch(updateUsername(text.toLocaleLowerCase()));
  };

  const _onPress = () => {
    Keyboard.dismiss();

    if (!authDto.sessionId || !authDto.username) {
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

    validateUsernameMutation.mutate({
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
      onTouchStart={_dismissKeyboard}
      bgColor={
        colorMode === "light" ? "$backgroundLight0" : "$backgroundDark950"
      }
    >
      <TopSection title={i18n.t("auth.username.title")}>
        <FormControl
          width={"100%"}
          isDisabled={
            validateUsernameMutation.isPending || signupMutation.isPending
          }
          isInvalid={validateUsernameMutation.isError}
        >
          <Input
            isDisabled={
              validateUsernameMutation.isPending || signupMutation.isPending
            }
            borderWidth={0}
            height={70}
          >
            <InputField
              onChangeText={_onChangeText}
              value={authDto.username}
              placeholder={i18n.t("auth.username.placeholder")}
              autoFocus={true}
              maxLength={USERNAME_MAX_LENGTH}
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              // selectionColor={colorMode === "dark" ? "white" : "black"}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={_onPress}
              fontSize="$3xl"
              fontFamily="Inter-ExtraBold"
              lineHeight="$3xl"
              textAlign="center"
            />
          </Input>
          {validateUsernameMutation.isError && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
              <FormControlErrorText
                fontFamily="Inter-Regular"
                flexShrink={1}
                flexWrap="wrap"
              >
                {validateUsernameMutation.error &&
                instanceOfErrorResponseType(validateUsernameMutation.error) &&
                validateUsernameMutation.error.statusCode === 409
                  ? i18n.t("errors.usernameAlreadyExists")
                  : validateUsernameMutation.error &&
                    instanceOfErrorResponseType(
                      validateUsernameMutation.error
                    ) &&
                    validateUsernameMutation.error.statusCode === 422
                  ? i18n.t("errors.invalid", {
                      field: i18n.t("fields.username"),
                    })
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
          !authDto.username ||
          authDto.username.length < USERNAME_MIN_LENGTH ||
          authDto.username.length > USERNAME_MAX_LENGTH ||
          !USERNAME_REGEX.test(authDto.username) ||
          validateUsernameMutation.isPending ||
          signupMutation.isPending
        }
        hint={i18n.t("auth.usernameHint")}
      />
    </KeyboardAvoidingView>
  );
};
export default UsernameScreen;
