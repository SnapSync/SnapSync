import { AppColorModeKey } from "@/costants/AsyncStorageKeys";
import { FontAwesome } from "@expo/vector-icons";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  AuthTokenKey,
  DeviceUuidKey,
  UserIdKey,
} from "@/costants/SecureStoreKeys";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function useCachedResources() {
  const [appIsReady, setAppIsReady] = useState(false);

  // const [fontsLoaded] = Font.useFonts({
  //   Inter_100Thin,
  //   Inter_200ExtraLight,
  //   Inter_300Light,
  //   Inter_400Regular,
  //   Inter_500Medium,
  //   Inter_600SemiBold,
  //   Inter_700Bold,
  //   Inter_800ExtraBold,
  //   Inter_900Black,
  // });

  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [colorMode, setColorMode] = useState<COLORMODES>("light");
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [deviceUuid, setDeviceUuid] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function prepare() {
      try {
        // Load AuthToken
        let authToken = await SecureStore.getItemAsync(AuthTokenKey);
        if (authToken) setAuthToken(authToken);

        // Load UserId
        let userId = await SecureStore.getItemAsync(UserIdKey);
        if (userId) setUserId(parseInt(userId));

        // Load fonts
        await Font.loadAsync({
          // ...FontAwesome.font,

          Inter_900Black: require("../assets/Fonts/Inter-Black.ttf"),
          Inter_700Bold: require("../assets/Fonts/Inter-Bold.ttf"),
          Inter_800ExtraBold: require("../assets/Fonts/Inter-ExtraBold.ttf"),
          Inter_200ExtraLight: require("../assets/Fonts/Inter-ExtraLight.ttf"),
          Inter_300Light: require("../assets/Fonts/Inter-Light.ttf"),
          Inter_500Medium: require("../assets/Fonts/Inter-Medium.ttf"),
          Inter_400Regular: require("../assets/Fonts/Inter-Regular.ttf"),
          Inter_600SemiBold: require("../assets/Fonts/Inter-SemiBold.ttf"),
          Inter_100Thin: require("../assets/Fonts/Inter-Thin.ttf"),

          // "Lora-Bold": require("../assets/Fonts/Lora-Bold.ttf"),
          // "Lora-BoldItalic": require("../assets/Fonts/Lora-BoldItalic.ttf"),
          // "Lora-Italic": require("../assets/Fonts/Lora-Italic.ttf"),
          // "Lora-Medium": require("../assets/Fonts/Lora-Medium.ttf"),
          // "Lora-MediumItalic": require("../assets/Fonts/Lora-MediumItalic.ttf"),
          // "Lora-Regular": require("../assets/Fonts/Lora-Regular.ttf"),
          // "Lora-SemiBold": require("../assets/Fonts/Lora-SemiBold.ttf"),
          // "Lora-SemiBoldItalic": require("../assets/Fonts/Lora-SemiBoldItalic.ttf"),
        });

        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return {
    appIsReady: appIsReady,
    cachedAuthToken: authToken,
    cachedUserId: userId,
  };
}
