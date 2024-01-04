import React, { useEffect } from "react";
import { DefaultTheme } from "@react-navigation/native";
import { Provider } from "react-redux";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import "react-native-reanimated";
import "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"; // so we can create a React Query persistor using Async Storage.
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LogLevel, OneSignal } from "react-native-onesignal";
import Store from "./utils/redux/store";
import CustomProvider from "./providers";
import RootNavigation from "./routers";
// import * as ScreenOrientation from "expo-screen-orientation";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"; // set of utilities to queryClient interaction with the persistor
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";

// import * as Sentry from "sentry-expo"; // Sentry -> @see -> https://docs.expo.dev/guides/using-sentry/
// import { vexo } from "vexo-analytics"; // Analytics -> @see -> https://docs.vexo.co/

// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
// OneSignal.initialize(Constants.expoConfig?.extra?.oneSignalAppId);

// Also need enable notifications to complete OneSignal setup
// OneSignal.Notifications.requestPermission(true);

// You may want to wrap this with `if (!__DEV__) { ... }` to only run Vexo in production.
// vexo(Constants.expoConfig?.extra?.vexoApiKey);

// Sentry.init({
//   dsn: Constants.expoConfig?.extra?.sentryDsn,
//   enableInExpoDevelopment: true,
//   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

const queryClient = new QueryClient();

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

const MyThemeDark = {
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A91FF", // The primary color of the app used to tint various elements. Usually you'll want to use your brand color for this.
    background: "#171717", // The color of various backgrounds, such as background color for the screens.
    text: "#FCFCFC", // The text color of various elements.
    card: "#171717", // The background color of card-like elements, such as headers, tab bars etc.
  },
};

const MyThemeLight = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0077E6",
    background: "#FCFCFC",
    text: "#171717",
    card: "#FCFCFC",
  },
};

export default function App() {
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status = !!state.isConnected;
      onlineManager.setOnline(status);
    });
  }, []);

  // useEffect(() => {
  //   if (Platform.OS !== "web") {
  //     ScreenOrientation.lockAsync(
  //       ScreenOrientation.OrientationLock.PORTRAIT_UP
  //     );
  //   }
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={Store}>
        <PersistQueryClientProvider
          persistOptions={{ persister }}
          onSuccess={() => {
            queryClient
              .resumePausedMutations()
              .then(() => queryClient.invalidateQueries());
          }}
          client={queryClient}
        >
          <CustomProvider>
            <RootNavigation />
          </CustomProvider>
        </PersistQueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );

  // return (
  //   <Provider store={store}>
  //     <PersistQueryClientProvider
  //       persistOptions={{ persister }}
  //       onSuccess={() => {
  //         queryClient
  //           .resumePausedMutations()
  //           .then(() => queryClient.invalidateQueries());
  //       }}
  //       client={queryClient}
  //     >
  //       <GestureHandlerRootView style={{ flex: 1 }}>
  //         <SafeAreaProvider
  //           style={{
  //             flex: 1,
  //             // paddingHorizontal: Layout.DefaultMarginHorizontal,
  //             // backgroundColor: colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
  //           }}
  //         >
  //           <NavigationContainer
  //             // @see -> https://reactnavigation.org/docs/themes/
  //             theme={colorMode === "dark" ? MyThemeDark : MyThemeLight}
  //           >
  //             <GluestackUIProvider config={config} colorMode={colorMode}>
  //               <BottomSheetModalProvider>
  //                 <RootNavigation authToken={cachedAuthToken} />
  //                 <StatusBar style={colorMode === "dark" ? "light" : "dark"} />
  //               </BottomSheetModalProvider>
  //             </GluestackUIProvider>
  //           </NavigationContainer>
  //         </SafeAreaProvider>
  //       </GestureHandlerRootView>
  //     </PersistQueryClientProvider>
  //   </Provider>
  // );
}
