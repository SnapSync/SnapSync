import { Layout } from "@/costants/Layout";
import i18n from "@/lang";
import {
  Button,
  Text,
  ButtonText,
  Icon,
  Pressable,
  ScrollView,
  TrashIcon,
  View,
  useColorMode,
  useToast,
  Toast,
  VStack,
  ToastDescription,
  ToastTitle,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { UserCircle2Icon } from "lucide-react-native";
import React from "react";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OtherScreen = () => {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const colorMode = useColorMode();
  const toast = useToast();

  const clearCache = () => {
    Alert.alert(
      i18n.t("clearCacheAlert.title"),
      i18n.t("clearCacheAlert.description"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("clear"),
          onPress: () => {
            queryClient.clear();
            toast.show({
              placement: "bottom",
              render: ({ id }) => {
                return (
                  <Toast
                    nativeID={"toast-" + id}
                    action="success"
                    variant="accent"
                  >
                    <VStack space="xs">
                      <ToastTitle fontSize="$sm">
                        {i18n.t("clearCacheAlert.successTitle")}
                      </ToastTitle>
                      <ToastDescription
                        // fontFamily="Inter-Regular"
                        fontSize="$sm"
                        lineHeight="$sm"
                      >
                        {i18n.t("clearCacheAlert.successDescription")}
                      </ToastDescription>
                    </VStack>
                  </Toast>
                );
              },
            });
          },
        },
      ]
    );
  };

  const deleteAccount = () => {
    // TODO: implement delete account
    console.log("deleteAccount");
  };

  return (
    <View flex={1} backgroundColor="transparent">
      <ScrollView
        flexGrow={1}
        style={{
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={clearCache}
          gap="$2"
          borderRadius="$xl"
          paddingHorizontal="$3"
          paddingVertical="$5"
          bgColor={
            colorMode === "dark" ? "$backgroundDark900" : "$backgroundLight50"
          }
          marginBottom="$10"
          flexDirection="row"
          alignItems="center"
          borderColor={
            colorMode === "dark" ? "$borderDark400" : "$borderLight400"
          }
          borderWidth="$1"
        >
          <Icon as={TrashIcon} size="sm" />
          <Text fontSize="$sm" lineHeight="$sm">
            {i18n.t("otherScreen.clearCache")}
          </Text>
        </Pressable>
        <Button
          action="negative"
          borderRadius="$xl"
          size="lg"
          onPress={deleteAccount}
        >
          <ButtonIcon as={UserCircle2Icon} />
          <ButtonText>{i18n.t("otherScreen.deleteAccount")}</ButtonText>
        </Button>
      </ScrollView>
    </View>
  );
};

export default OtherScreen;
