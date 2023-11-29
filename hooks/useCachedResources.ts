import { AppColorModeKey } from "@/costants/AsyncStorageKeys";
import { FontAwesome } from "@expo/vector-icons";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  AuthTokenKey,
  DeviceUuidKey,
  UserIdKey,
} from "@/costants/SecureStoreKeys";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [colorMode, setColorMode] = useState<COLORMODES>("light");
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [deviceUuid, setDeviceUuid] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        try {
          const value = await AsyncStorage.getItem(AppColorModeKey);
          if (value !== null && (value === "light" || value === "dark"))
            setColorMode(value);
        } catch (e) {
          console.warn(e);
        }

        // Provo a recuperare l'authToken dallo storage
        let authToken = await SecureStore.getItemAsync(AuthTokenKey);
        if (authToken) setAuthToken(authToken);

        // Provo a recuperare il deviceUuid dallo storage
        let deviceUuid = await SecureStore.getItemAsync(DeviceUuidKey);
        if (deviceUuid) {
          setDeviceUuid(deviceUuid);
        } else {
          // Se non lo trovo allora lo registro nella schermata successiva
        }

        // Provo a recuperare l'userId dallo storage
        let userId = await SecureStore.getItemAsync(UserIdKey);
        if (userId) setUserId(parseInt(userId));

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,

          "Inter-Black": require("../assets/Fonts/Inter-Black.ttf"),
          "Inter-Bold": require("../assets/Fonts/Inter-Bold.ttf"),
          "Inter-ExtraBold": require("../assets/Fonts/Inter-ExtraBold.ttf"),
          "Inter-ExtraLight": require("../assets/Fonts/Inter-ExtraLight.ttf"),
          "Inter-Light": require("../assets/Fonts/Inter-Light.ttf"),
          "Inter-Medium": require("../assets/Fonts/Inter-Medium.ttf"),
          "Inter-Regular": require("../assets/Fonts/Inter-Regular.ttf"),
          "Inter-SemiBold": require("../assets/Fonts/Inter-SemiBold.ttf"),
          "Inter-Thin": require("../assets/Fonts/Inter-Thin.ttf"),

          "Lora-Bold": require("../assets/Fonts/Lora-Bold.ttf"),
          "Lora-BoldItalic": require("../assets/Fonts/Lora-BoldItalic.ttf"),
          "Lora-Italic": require("../assets/Fonts/Lora-Italic.ttf"),
          "Lora-Medium": require("../assets/Fonts/Lora-Medium.ttf"),
          "Lora-MediumItalic": require("../assets/Fonts/Lora-MediumItalic.ttf"),
          "Lora-Regular": require("../assets/Fonts/Lora-Regular.ttf"),
          "Lora-SemiBold": require("../assets/Fonts/Lora-SemiBold.ttf"),
          "Lora-SemiBoldItalic": require("../assets/Fonts/Lora-SemiBoldItalic.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return {
    isLoadingComplete: isLoadingComplete,
    cachedColorMode: colorMode,
    cachedAuthToken: authToken,
    cachedDeviceUuid: deviceUuid,
    cachedUserId: userId,
  };
}
