import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthTokenKey } from "@/costants/SecureStoreKeys";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function useCachedResources() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function prepare() {
      try {
        // Load AuthToken
        let authToken = await SecureStore.getItemAsync(AuthTokenKey);
        if (authToken) setAuthToken(authToken);

        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
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
  };
}
