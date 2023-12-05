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
} from "@gluestack-ui/themed";
import { Keyboard, Platform } from "react-native";
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
import { instanceOfErrorResponseType } from "@/api";
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
    // Keyboard.dismiss();

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
      paddingLeft={insets.left + Layout.DefaultMarginHorizontal}
      paddingRight={insets.right + Layout.DefaultMarginHorizontal}
      paddingTop={insets.top}
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // onTouchStart={_onTouchStart}
      bgColor={
        colorMode === "light" ? "$backgroundLight0" : "$backgroundDark950"
      }
    >
      <TopSection title={i18n.t("auth.fullname.title")}>
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
              // selectionColor={colorMode === "dark" ? "white" : "black"}
              // style={authStyles.input}
              onSubmitEditing={_onPress}
              fontSize="$3xl"
              fontFamily="Inter-ExtraBold"
              lineHeight="$3xl"
              textAlign="center"
            />
          </Input>
          {validateFullnameMutation.isError && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText
                fontFamily="Inter-Regular"
                flexShrink={1}
                flexWrap="wrap"
              >
                {validateFullnameMutation.error &&
                instanceOfErrorResponseType(validateFullnameMutation.error) &&
                validateFullnameMutation.error.statusCode === 422
                  ? i18n.t("errors.fieldNotValid")
                  : i18n.t("errors.generic")}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </TopSection>
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
      />
    </KeyboardAvoidingView>
  );
};
export default FullNameScreen;
