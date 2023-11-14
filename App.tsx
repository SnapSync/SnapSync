import React from "react";
import { config } from "./config/gluestack-ui.config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCachedResources from "@/hooks/useCachedResources";
import { Layout } from "./costants/Layout";
import RootNavigation from "./navigation";
import { store } from "@/redux/app/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const queryClient = new QueryClient();

export default function App() {
  const { isLoadingComplete, cachedColorMode } = useCachedResources();

  // const colorMode = useSelector((state: RootState) => state.app.colorMode);
  // const dispatch = useDispatch();

  // const [colorMode, setColorMode] = React.useState<COLORMODES>("dark");

  // React.useEffect(() => {
  //   dispatch(setColorMode(cachedColorMode));
  // }, [cachedColorMode]);

  if (!isLoadingComplete) return null;

  // const _switchColorMode = async () => {
  //   let newColorMode: COLORMODES = colorMode === "light" ? "dark" : "light";

  //   // Salvo il nuovo colorMode in AsyncStorage, in modo che al prossimo avvio dell'app il colorMode sia quello salvato
  //   try {
  //     await AsyncStorage.setItem(AppColorModeKey, newColorMode);
  //   } catch (e) {
  //     console.warn(e);
  //   }

  //   dispatch(setColorMode(newColorMode));
  // };

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView
            style={{
              flex: 1,
              // paddingHorizontal: Layout.DefaultMarginHorizontal,
              // backgroundColor: colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
            }}
          >
            <NavigationContainer>
              <GluestackUIProvider config={config} colorMode={"dark"}>
                <BottomSheetModalProvider>
                  <RootNavigation />
                </BottomSheetModalProvider>
              </GluestackUIProvider>
            </NavigationContainer>
          </SafeAreaView>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}
