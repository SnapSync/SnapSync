import React from "react";
import { UserSettingsStackScreenProps } from "@/types";
import {
  Button,
  ButtonText,
  Icon,
  Pressable,
  View,
  useColorMode,
  Text,
  Spinner,
} from "@gluestack-ui/themed";
import { SCREEN_WIDTH } from "@/utils/helper";
import {
  FlashlightIcon,
  FlashlightOffIcon,
  SwitchCameraIcon,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { Camera, CameraType, FlashMode } from "expo-camera";
import i18n from "@/lang";
import { TouchableOpacity } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { WebChangeProfilePicture } from "@/api/routes/accounts.route";
import { IEditWebFormData } from "@/interfaces/edit_web_form_data";
import EditProfileKeys from "../edit_profile/edit_profile.keys";
import { IApiUser } from "@/interfaces/users.interface";
import ProfileKeys from "@/screens/profile/profile/profile.keys";

const TakeProfilePictureScreen = ({
  navigation,
}: UserSettingsStackScreenProps<"TakeProfilePicture">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();
  const queryClient = useQueryClient();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const ref = React.useRef<Camera>(null);

  const [type, setType] = React.useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashMode, setFlashMode] = React.useState(FlashMode.off);
  const [isCameraReady, setIsCameraReady] = React.useState(false);

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
          return {
            ...old,
            profilePicture: data.profilePicture,
          };
        }
      });

      // Aggiorno la cache di [UserProfileKeys.userProfile, id]
    },
  });

  React.useEffect(() => {
    if (changeProfilePictureMutation.isSuccess) navigation.goBack();
  }, [changeProfilePictureMutation]);

  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === FlashMode.off
        ? FlashMode.on
        : flashMode === FlashMode.on
        ? FlashMode.auto
        : FlashMode.off
    );
  };

  const takePic = async () => {
    if (!isCameraReady) return;

    const photo = await ref.current?.takePictureAsync({
      quality: 1,
    });

    if (!photo) return;

    changeProfilePictureMutation.mutate({ uri: photo.uri });
  };

  return (
    <View flex={1} backgroundColor="transparent">
      <View
        flex={1}
        maxWidth={SCREEN_WIDTH}
        maxHeight={SCREEN_WIDTH}
        backgroundColor="transparent"
        overflow="hidden"
      >
        {!permission ? null : !permission.granted ? (
          <View
            flex={1}
            backgroundColor="transparent"
            alignItems="center"
            justifyContent="center"
            paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
            paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
          >
            <TouchableOpacity onPress={() => requestPermission()}>
              <Text fontFamily="Inter_500Medium" size="md">
                {i18n.t("takeProfilePictureScreen.requestPermission")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Camera
            ref={ref}
            style={{
              flex: 1,
            }}
            type={type}
            onCameraReady={() => setIsCameraReady(true)}
            flashMode={flashMode}
          />
        )}
      </View>
      <View
        flex={1}
        backgroundColor="transparent"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        paddingTop={50}
        paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
        paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
      >
        <Pressable
          backgroundColor={
            colorMode === "dark" ? "$backgroundLight0" : "$backgroundDark950"
          }
          padding="$4"
          borderRadius="$full"
          onPress={() => toggleCameraType()}
        >
          <Icon
            as={SwitchCameraIcon}
            size="xl"
            color={colorMode === "dark" ? "$textLight950" : "$textDark0"}
          />
        </Pressable>
        {changeProfilePictureMutation.isPending ? (
          <Spinner size="large" />
        ) : (
          <Pressable
            borderColor={
              colorMode === "dark" ? "$backgroundLight0" : "$backgroundDark950"
            }
            borderWidth="$4"
            width={80}
            height={80}
            borderRadius="$full"
            onPress={() => takePic()}
            disabled={
              !isCameraReady ||
              !permission ||
              !permission.granted ||
              changeProfilePictureMutation.isPending
            }
          />
        )}

        <Pressable
          backgroundColor={
            colorMode === "dark" ? "$backgroundLight0" : "$backgroundDark950"
          }
          padding="$4"
          borderRadius="$full"
          onPress={() => toggleFlashMode()}
        >
          <Icon
            as={
              flashMode === FlashMode.off ? FlashlightOffIcon : FlashlightIcon
            }
            size="xl"
            color={colorMode === "dark" ? "$textLight950" : "$textDark0"}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default TakeProfilePictureScreen;
