import React, { useCallback, useEffect, useState } from "react";
import { Appearance, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import InterFont from "@/assets/Fonts";
import { useAppDispatch } from "@/utils/redux/store";
import { SetColorShceme } from "@/modules/app/redux/appSlice";
import {
  addStoreDataAsync,
  getSecureStoreDataAsync,
  getStoreDataAsync,
  removeSecureStoreDataAsync,
} from "@/helpers/storage";
import { storeEnum } from "@/helpers/storage/Abstract";
import NetInfo from "@react-native-community/netinfo";
import { loginAuthToken } from "@/modules/app/api";
import { isIError } from "@/utils/network/Abstract";
import { signIn } from "@/modules/app/services/appService";
// import * as SystemUI from "expo-system-ui";

SplashScreen.preventAutoHideAsync();

type Props = {
  children: React.ReactNode;
};

function AppLoadingProvider({ children }: Props) {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(InterFont);

        // Load the user's color scheme preference from storage
        let userColorScheme = await getStoreDataAsync(storeEnum.ColorMode);
        if (
          userColorScheme === null ||
          userColorScheme === undefined ||
          (userColorScheme !== "dark" && userColorScheme !== "light")
        ) {
          let colorScheme = Appearance.getColorScheme(); // Get the OS preference

          // If not found or is not valid, use the OS preference
          dispatch(SetColorShceme(colorScheme));

          // Update the stored preference to the OS preference
          // if (colorScheme !== null && colorScheme !== undefined)
          //   await addStoreDataAsync(storeEnum.ColorMode, colorScheme);
        } else {
          // Otherwise, use the stored preference
          dispatch(SetColorShceme(userColorScheme));
        }

        // Try to SignIn with AuthToken
        // let authToken = await getSecureStoreDataAsync(storeEnum.AuthToken);
        // if (authToken.length > 0) {
        //   // Check if the user is connected to the internet
        //   let netInfo = await NetInfo.fetch();
        //   if (netInfo.isConnected) {
        //     try {
        //       const data = await loginAuthToken({ authToken: authToken });
        //       signIn(data.result);
        //     } catch (e) {
        //       console.log(JSON.stringify(e));
        //       // If there is an error, remove the AuthToken
        //       if (
        //         isIError(e) &&
        //         (e.status === 404 || e.status === 401 || e.status === 403)
        //       )
        //         await removeSecureStoreDataAsync(storeEnum.AuthToken);
        //     }
        //   }
        // }

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View
      onLayout={onLayoutRootView}
      style={{ flex: 1, backgroundColor: "transparent" }}
    >
      {children}
    </View>
  );
}

export default AppLoadingProvider;
