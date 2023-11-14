import { AppColorModeKey } from "@/costants/AsyncStorageKeys";
import { FontAwesome } from "@expo/vector-icons";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [colorMode, setColorMode] = useState<COLORMODES>("light");

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
  };
}
