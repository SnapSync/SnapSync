import {
  Button,
  ButtonText,
  useColorMode,
  Text,
  KeyboardAvoidingView,
  View,
  useToast,
  Toast,
  VStack,
  ToastTitle,
  ToastDescription,
  ButtonSpinner,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { Keyboard, Platform } from "react-native";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import styles from "../auth.styles";
import i18n from "@/lang";
import { AuthStackScreenProps } from "@/types";
import otpStyles from "./otp.styles";

const OtpScreen = ({ navigation, route }: AuthStackScreenProps<"Otp">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const toast = useToast();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  // const validatePhoneNumberMutation = useMutation({
  //   mutationFn: (data: {
  //     phoneNumber: string;
  //     sessionId: string;
  //     deviceUuid: string;
  //   }) =>
  //     ValidatePhoneNumber(data.sessionId, data.phoneNumber, data.deviceUuid),
  //   onSuccess: () => {
  //     // navigation.navigate("PhoneNumber", {
  //     //   DeviceUuid: route.params.DeviceUuid,
  //     // });
  //   },
  //   onError: (error) => {
  //     let message = i18n.t("errors.generic");
  //     let title: string | null = null;

  //     if (
  //       error &&
  //       instanceOfErrorResponseType(error) &&
  //       error.statusCode === 422
  //     ) {
  //       title = i18n.t("errors.unprocessableEntityTitle");
  //       message = error.message;
  //     }

  //     // Mostro il toast
  //     toast.show({
  //       placement: "top",
  //       render: ({ id }) => {
  //         return (
  //           <Toast nativeID={"toast-" + id} action="error" variant="accent">
  //             <VStack space="xs">
  //               {title && <ToastTitle>{title}</ToastTitle>}
  //               <ToastDescription>{message}</ToastDescription>
  //             </VStack>
  //           </Toast>
  //         );
  //       },
  //     });
  //   },
  // });

  const _dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const _handlePressContinue = () => {
    Keyboard.dismiss();
  };

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
            {i18n.t("auth.otp.title")}
          </Text>
          <Text
            style={styles.textSubTitle}
            color={colorMode === "light" ? "$textLight700" : "$textDark400"}
          >
            {i18n.t("auth.otp.subtitle")}
          </Text>
        </View>
        <View style={otpStyles.viewOptInputContainer}>
          {/* <Input
            size={"sm"}
            variant={"underlined"}
            isInvalid={false}
            isDisabled={false}
            isRequired={true}
            width={36}
          >
            <InputField
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "dark"}
              maxLength={1}
              keyboardType="number-pad"
            />
          </Input>
          <Input
            size={"sm"}
            variant={"underlined"}
            isInvalid={false}
            isDisabled={false}
            isRequired={true}
            width={36}
          >
            <InputField
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "dark"}
              maxLength={1}
              keyboardType="number-pad"
            />
          </Input>
          <Input
            size={"sm"}
            variant={"underlined"}
            isInvalid={false}
            isDisabled={false}
            isRequired={true}
            width={36}
          >
            <InputField
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "dark"}
              maxLength={1}
              keyboardType="number-pad"
            />
          </Input>
          <Input
            size={"sm"}
            variant={"underlined"}
            isInvalid={false}
            isDisabled={false}
            isRequired={true}
            width={36}
          >
            <InputField
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "dark"}
              maxLength={1}
              keyboardType="number-pad"
            />
          </Input>
          <Input
            size={"sm"}
            variant={"underlined"}
            isInvalid={false}
            isDisabled={false}
            isRequired={true}
            width={36}
          >
            <InputField
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "dark"}
              maxLength={1}
              keyboardType="number-pad"
            />
          </Input>
          <Input
            size={"sm"}
            variant={"underlined"}
            isInvalid={false}
            isDisabled={false}
            isRequired={true}
            width={36}
          >
            <InputField
              keyboardAppearance={colorMode === "light" ? "light" : "dark"}
              selectionColor={colorMode === "dark" ? "white" : "dark"}
              maxLength={1}
              keyboardType="number-pad"
            />
          </Input> */}
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
          isDisabled={false}
          borderRadius={14}
          width={"100%"}
          onPress={_handlePressContinue}
        >
          {/* {validateFullnameMutation.isPending ? (
            <ButtonSpinner size="small" />
          ) : (
            <ButtonText>
              {
                // Prima lettera maiuscola
                i18n.t("continue").charAt(0).toUpperCase() +
                  i18n.t("continue").slice(1)
              }
            </ButtonText>
          )} */}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;
