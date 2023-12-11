import React, { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import EditProfileKeys from "./edit_profile.keys";
import {
  FetchEditWebFormData,
  UpdateAccount,
  WebChangeProfilePicture,
  WebRemoveProfilePicture,
} from "@/api/routes/accounts.route";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Icon,
  Input,
  InputField,
  KeyboardAvoidingView,
  Pressable,
  Spinner,
  Toast,
  ToastDescription,
  VStack,
  View,
  useColorMode,
  useToast,
} from "@gluestack-ui/themed";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "@/screens/auth/username/username.costants";
import {
  FULLNAME_MAX_LENGTH,
  FULLNAME_MIN_LENGTH,
  FULLNAME_REGEX,
} from "@/screens/auth/fullname/fullname.costants";
import { BIOGRAPHY_MAX_LENGTH } from "./edit_profile.constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import i18n from "@/lang";
import { UserSettingsStackScreenProps } from "@/types";
import {
  CameraIcon,
  GalleryHorizontalEndIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react-native";
import { Skeleton } from "moti/skeleton";
import ProfileKeys from "@/screens/profile/profile/profile.keys";
import { instanceOfErrorResponseType } from "@/api";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "@/components/custom_backdrop/custom_backdrop.component";
import BottomSheetItem from "@/components/bottom_sheet_item/bottom_sheet_item.component";
import { IEditWebFormData } from "@/interfaces/edit_web_form_data";
import { IApiUser } from "@/interfaces/users.interface";
import * as ImagePicker from "expo-image-picker";

const EditProfileScreen = ({
  navigation,
}: UserSettingsStackScreenProps<"EditProfile">) => {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const toast = useToast();
  const { dismissAll } = useBottomSheetModal();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(() => ["25%", "50%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={() => dismissAll()}
      />
    ),
    []
  );

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const updateAccountMutation = useMutation({
    mutationFn: (data: {
      username: string;
      fullname: string;
      biography: string;
    }) => UpdateAccount(tokenApi, data.username, data.fullname, data.biography),
    onError: (error) => {
      let message = i18n.t("errors.generic");

      if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 409
      ) {
        // Il nome utente è già in uso
        message = i18n.t("errors.usernameAlreadyExists");
      } else if (
        error &&
        instanceOfErrorResponseType(error) &&
        error.statusCode === 422
      ) {
        message = i18n.t("errors.invalidData");
      }

      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="accent">
              <VStack space="xs">
                <ToastDescription>{message}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    },
    onSuccess(data) {
      // ditProfileKeys.editWebFormData
      queryClient.setQueryData<IEditWebFormData>(
        EditProfileKeys.editWebFormData,
        data
      );

      // Aggiorno la cache di ProfileKeys.me
      queryClient.setQueryData<IApiUser>(ProfileKeys.me, (old) => {
        if (old) {
          return {
            ...old,
            username: data.username,
            fullname: data.fullname,
            biography: data.biography,
          };
        }
      });

      // Aggiorno la cache di [UserProfileKeys.userProfile, id]
    },
  });

  const removeProfilePictureMutation = useMutation({
    mutationFn: () => WebRemoveProfilePicture(tokenApi),
    onSuccess(data) {
      // ditProfileKeys.editWebFormData
      queryClient.setQueryData<IEditWebFormData>(
        EditProfileKeys.editWebFormData,
        (old) => {
          if (old) {
            return {
              ...old,
              profilePicture: data.profilePicture,
            };
          }
        }
      );

      // Aggiorno la cache di ProfileKeys.me
      queryClient.setQueryData<IApiUser>(ProfileKeys.me, (old) => {
        if (old) {
          return {
            ...old,
            profilePicture: data.profilePicture,
          };
        }
      });

      // Aggiorno la cache di [UserProfileKeys.userProfile, id]
    },
  });

  const changeProfilePictureMutation = useMutation({
    mutationFn: (data: { uri: string }) =>
      WebChangeProfilePicture(data.uri, tokenApi),
    onSuccess(data) {
      // ditProfileKeys.editWebFormData
      queryClient.setQueryData<IEditWebFormData>(
        EditProfileKeys.editWebFormData,
        (old) => {
          if (old) {
            return {
              ...old,
              profilePicture: data.profilePicture,
            };
          }
        }
      );

      // Aggiorno la cache di ProfileKeys.me
      queryClient.setQueryData<IApiUser>(ProfileKeys.me, (old) => {
        if (old) {
          console.log(JSON.stringify(old));
          return {
            ...old,
            profilePicture: data.profilePicture,
          };
        }
      });

      // Aggiorno la cache di [UserProfileKeys.userProfile, id]
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: EditProfileKeys.editWebFormData,
    queryFn: () => FetchEditWebFormData(tokenApi),
    enabled: isLoggedIn,
    refetchOnWindowFocus: "always",
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: data?.username || "",
      fullname: data?.fullname || "",
      biography: (data && data.biography) || "",
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required()
        .min(USERNAME_MIN_LENGTH)
        .max(USERNAME_MAX_LENGTH)
        .matches(USERNAME_REGEX),
      fullname: yup
        .string()
        .required()
        .min(FULLNAME_MIN_LENGTH)
        .max(FULLNAME_MAX_LENGTH)
        .matches(FULLNAME_REGEX),
      biography: yup.string().nullable().max(BIOGRAPHY_MAX_LENGTH),
    }),
    onSubmit: (values) => {
      updateAccountMutation.mutate({
        username: values.username,
        fullname: values.fullname,
        biography: values.biography,
      });
    },
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          disabled={!formik.dirty || updateAccountMutation.isPending}
          style={{ opacity: !formik.dirty || !formik.isValid ? 0.5 : 1 }}
        >
          {updateAccountMutation.isPending ? (
            <Spinner
              size="small"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          ) : (
            <Icon
              as={SaveIcon}
              size="md"
              color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, formik, updateAccountMutation]);

  React.useEffect(() => {
    if (updateAccountMutation.isSuccess) navigation.goBack();
  }, [updateAccountMutation]);

  const removeProfilePicture = () => {
    dismissAll();
    removeProfilePictureMutation.mutate();
  };

  const pickImage = async () => {
    dismissAll();

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      changeProfilePictureMutation.mutate({ uri });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      flex={1}
      backgroundColor="transparent"
    >
      <ScrollView
        contentContainerStyle={{
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
          paddingTop: 10,
        }}
        automaticallyAdjustKeyboardInsets={true}
      >
        <View
          alignItems="center"
          justifyContent="center"
          backgroundColor="transparent"
        >
          <View borderRadius="$full" backgroundColor="transparent">
            <Skeleton
              colorMode={colorMode === "dark" ? "dark" : "light"}
              radius="round"
              show={isLoading}
            >
              <Pressable
                onPress={handlePresentModalPress}
                disabled={
                  isLoading ||
                  changeProfilePictureMutation.isPending ||
                  removeProfilePictureMutation.isPending
                }
              >
                <Avatar size="xl">
                  <AvatarFallbackText fontFamily="Inter-Bold">
                    {data?.username || data?.fullname}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: data?.profilePicture?.url,
                    }}
                  />
                </Avatar>
                {!isLoading ? (
                  <View
                    width={20}
                    height={20}
                    borderRadius="$full"
                    position="absolute"
                    bottom={0}
                    right={10}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      as={CameraIcon}
                      size="2xs"
                      color={
                        colorMode === "dark" ? "$textDark0" : "$textLight950"
                      }
                    />
                  </View>
                ) : null}
              </Pressable>
            </Skeleton>
          </View>
        </View>
        <View gap={20} marginTop={20}>
          {isLoading ? (
            <View width={"100%"} gap={4}>
              <Skeleton
                colorMode={colorMode === "dark" ? "dark" : "light"}
                width={80}
                height={22}
              />
              <Skeleton
                colorMode={colorMode === "dark" ? "dark" : "light"}
                width="100%"
                height={40}
              />
            </View>
          ) : (
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText fontFamily="Inter-Bold">
                  {i18n.t("fields.username")}
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="underlined">
                <InputField
                  value={formik.values.username}
                  onChangeText={(text) =>
                    formik.setFieldValue("username", text)
                  }
                  fontFamily="Inter-Regular"
                  keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                />
              </Input>
            </FormControl>
          )}

          {isLoading ? (
            <View width={"100%"} gap={4}>
              <Skeleton
                colorMode={colorMode === "dark" ? "dark" : "light"}
                width={80}
                height={22}
              />
              <Skeleton
                colorMode={colorMode === "dark" ? "dark" : "light"}
                width="100%"
                height={40}
              />
            </View>
          ) : (
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText fontFamily="Inter-Bold">
                  {i18n.t("fields.fullname")}
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="underlined">
                <InputField
                  value={formik.values.fullname}
                  onChangeText={(text) =>
                    formik.setFieldValue("fullname", text)
                  }
                  fontFamily="Inter-Regular"
                  keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                  autoComplete="name"
                />
              </Input>
            </FormControl>
          )}
          {isLoading ? (
            <View width={"100%"} gap={4}>
              <Skeleton
                colorMode={colorMode === "dark" ? "dark" : "light"}
                width={80}
                height={22}
              />
              <Skeleton
                colorMode={colorMode === "dark" ? "dark" : "light"}
                width="100%"
                height={40}
              />
            </View>
          ) : (
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText fontFamily="Inter-Bold">
                  {i18n.t("fields.biography")}
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="underlined">
                <InputField
                  value={formik.values.biography}
                  onChangeText={(text) =>
                    formik.setFieldValue("biography", text)
                  }
                  fontFamily="Inter-Regular"
                  keyboardAppearance={colorMode === "light" ? "light" : "dark"}
                  autoComplete="off"
                  multiline
                  numberOfLines={4}
                />
              </Input>
            </FormControl>
          )}
        </View>
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: colorMode === "dark" ? "#171717" : "#FCFCFC",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorMode === "dark" ? "#FCFCFC" : "#171717",
        }}
        backdropComponent={renderBackdrop}
      >
        <View
          flex={1}
          backgroundColor="transparent"
          paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
          paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
        >
          {data ? (
            <>
              <BottomSheetItem
                iconAs={CameraIcon}
                label={i18n.t("editProfile.bottomSheetModal.takePhoto")}
                withDivider
                disabled={
                  changeProfilePictureMutation.isPending ||
                  removeProfilePictureMutation.isPending
                }
              />
              <BottomSheetItem
                iconAs={GalleryHorizontalEndIcon}
                label={i18n.t("editProfile.bottomSheetModal.chooseFromLibrary")}
                withDivider={data.profilePicture ? true : false}
                onPress={pickImage}
                disabled={
                  changeProfilePictureMutation.isPending ||
                  removeProfilePictureMutation.isPending
                }
              />
              {data.profilePicture ? (
                <BottomSheetItem
                  iconAs={Trash2Icon}
                  label={i18n.t(
                    "editProfile.bottomSheetModal.removeProfilePicture"
                  )}
                  variant="danger"
                  onPress={removeProfilePicture}
                  disabled={removeProfilePictureMutation.isPending}
                />
              ) : null}
            </>
          ) : null}
        </View>
      </BottomSheetModal>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
