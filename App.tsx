import React, { useEffect } from "react";
import { config } from "./config/gluestack-ui.config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "@/hooks/useCachedResources";
import RootNavigation from "./navigation";
import { store } from "@/redux/app/store";
import { Provider } from "react-redux";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"; // so we can create a React Query persistor using Async Storage.
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"; // set of utilities to queryClient interaction with the persistor
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "@rneui/themed";
import { LogLevel, OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize(Constants.expoConfig?.extra?.oneSignalAppId);

// Also need enable notifications to complete OneSignal setup
// OneSignal.Notifications.requestPermission(true);

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
  const { appIsReady, cachedAuthToken, cachedUserId } = useCachedResources();

  const colorScheme = useColorScheme();
  // const colorMode = useColorMode();

  const [colorMode, setColorMode] = React.useState<"light" | "dark">("dark");

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status = !!state.isConnected;
      onlineManager.setOnline(status);
    });
  }, []);

  if (!appIsReady) return null;

  return (
    <Provider store={store}>
      <PersistQueryClientProvider
        persistOptions={{ persister }}
        onSuccess={() => {
          queryClient
            .resumePausedMutations()
            .then(() => queryClient.invalidateQueries());
        }}
        client={queryClient}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider
            style={{
              flex: 1,
              // paddingHorizontal: Layout.DefaultMarginHorizontal,
              // backgroundColor: colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
            }}
          >
            <NavigationContainer
              // @see -> https://reactnavigation.org/docs/themes/
              theme={colorMode === "dark" ? MyThemeDark : MyThemeLight}
            >
              <GluestackUIProvider config={config} colorMode={colorMode}>
                <ThemeProvider
                  theme={{
                    mode: colorMode,
                    lightColors: {
                      primary: "#0077E6",
                      background: "#FCFCFC",
                    },
                    darkColors: {
                      primary: "#1A91FF",
                      background: "#171717",
                    },
                  }}
                >
                  <BottomSheetModalProvider>
                    <RootNavigation
                      authToken={cachedAuthToken}
                      userId={cachedUserId}
                    />
                    <StatusBar
                      style={colorMode === "dark" ? "light" : "dark"}
                    />
                  </BottomSheetModalProvider>
                </ThemeProvider>
              </GluestackUIProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistQueryClientProvider>
    </Provider>
  );
}
