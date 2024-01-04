import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { useAppSelector } from "@/utils/redux/store";
import { Dimensions, View } from "react-native";
import translate from "@/helpers/localization";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks";
import { navigationRef } from "./Router";
import BottomNavigation from "./BottomNavigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import OnboardingNavigation from "./OnboardingNavigation";
import { config } from "@/config/gluestack-ui.config";
import { RootStackParamList } from "@/utils/Routes";
import AuthNavigation from "./AuthNavigation";
import { useIsFirstRender } from "usehooks-ts";
import {
  addStoreDataAsync,
  getStoreDataAsync,
  getStoreStringAsync,
} from "@/helpers/storage";
import { storeEnum } from "@/helpers/storage/Abstract";

enableScreens();

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
  gestureEnabled: true,
  gestureResponseDistance: Dimensions.get("screen").width,
  headerShown: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  // headerStyle: { backgroundColor: "#FFF" },
  // headerTitleStyle: { fontFamily: "Bold" },
  headerTitleAlign: "center",
};

function RootNavigation() {
  const isFirst = useIsFirstRender();
  const hasLaunched = React.useRef<boolean>(false);

  const isSignedIn = useAppSelector((s) => s.AppReducer?.isSignedIn);
  const ucm = useAppSelector((s) => s.AppReducer.userColorScheme);
  const theme = useTheme();

  const [isLoadingHasLaunched, setIsLoadingHasLaunched] = React.useState(true);

  React.useEffect(() => {
    const loadAsyncStorage = async () => {
      const hasLaunchedAS = await getStoreStringAsync(storeEnum.HasLaunched);
      if (hasLaunchedAS === "true") {
        hasLaunched.current = true;
      } else {
        // user has not launched the app yet
        await addStoreDataAsync(storeEnum.HasLaunched, "true");
      }

      setIsLoadingHasLaunched(false);
    };

    if (isFirst) {
      // Check if user has launched the app before
      loadAsyncStorage();
    } else {
      setIsLoadingHasLaunched(false);
    }
  }, []);

  if (isLoadingHasLaunched) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GluestackUIProvider
        config={config}
        colorMode={ucm === "dark" ? "dark" : "light"}
      >
        <BottomSheetModalProvider>
          <NavigationContainer
            ref={navigationRef}
            theme={{
              dark: ucm === "dark",
              colors: {
                ...DefaultTheme.colors,
                primary: theme.primary,
                background: theme.background,
                text: theme.text,
                card: theme.card,
              },
            }}
          >
            <Stack.Navigator
              initialRouteName={
                isSignedIn
                  ? "Main"
                  : hasLaunched.current
                    ? "Auth"
                    : "Onboarding"
              }
              screenOptions={{ ...screenOptions }}
            >
              {isSignedIn ? (
                <>
                  <Stack.Screen
                    name={"Main"}
                    component={BottomNavigation}
                    options={{
                      gestureEnabled: false,
                      headerShown: false,
                      headerTitle: translate("navigation.home"),
                    }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name={"Onboarding"}
                    component={OnboardingNavigation}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name={"Auth"}
                    component={AuthNavigation}
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

export default React.memo(RootNavigation);

// import * as Linking from 'expo-linking';
// import * as Notifications from 'expo-notifications';
// const prefix = Linking.createURL('/');

// const notificationType = {
//   Post: 1,
// };

// // Change ip
// const baseUrl = 'exp://111.111.111.111:19000/--';

// const config = {
//   screens: {
//     Home: {
//       screens: {

//         Profile: {

//           screens: {
//             Post: 'mypost/:id',
//           },

//         }

//       },
//     },
//   },
// };

// const _linking = {
//   prefixes: [prefix],
//   config,
//   subscribe(listener) {

//     const onReceiveURL = ({ url }) => listener(url);

//     Linking.addEventListener('url', onReceiveURL);

//     const subscription = Notifications.addNotificationResponseReceivedListener((response) => {

//       // From API
//       const data = response?.notification?.request?.content.data;

//       if (data?.NotificationId === notificationType.Post) {

//         listener(`${baseUrl}/mypost/${data?.Data}`);

//       }

//     });

//     return () => {

//       Linking.removeEventListener('url', onReceiveURL);

//       subscription.remove();

//     };

//   },
// };
