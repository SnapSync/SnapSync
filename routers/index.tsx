import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { useAppSelector } from '@/utils/redux/store';
import { Dimensions, Text, View } from 'react-native';
import translate from '@/helpers/localization';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useConnectivity, useTheme } from '@/hooks';
import BottomNavigation from './BottomNavigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import OnboardingNavigation from './OnboardingNavigation';
import { config } from '@/config/gluestack-ui.config';
import { RootStackParamList } from '@/utils/Routes';
import AuthNavigation from './AuthNavigation';
import UserProfileNavigation from './UserProfileNavigation';
import { useIsFirstRender } from 'usehooks-ts';
import {
  addStoreDataAsync,
  getSecureStoreDataAsync,
  getStoreDataAsync,
  getStoreStringAsync,
  removeSecureStoreDataAsync,
} from '@/helpers/storage';
import { storeEnum } from '@/helpers/storage/Abstract';
import { useMutation } from '@tanstack/react-query';
import { loginAuthToken } from '@/modules/app/api';
import { signIn } from '@/modules/app/services/appService';
import { isIError } from '@/utils/network/Abstract';
import ProfileSettingsNavigation from './ProfileSettingsNavigation';

enableScreens();

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
  gestureEnabled: true,
  gestureResponseDistance: Dimensions.get('screen').width,
  headerShown: false,
  // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  // headerStyle: { backgroundColor: "#FFF" },
  // headerTitleStyle: { fontFamily: "Bold" },
  headerTitleAlign: 'center',
};

function RootNavigation() {
  const isFirst = useIsFirstRender();
  const [isConnected, checkConnection] = useConnectivity();
  const hasLaunched = React.useRef<boolean>(false);
  const authToken = React.useRef<string>('');

  const isSignedIn = useAppSelector((s) => s.AppReducer?.isSignedIn);
  const ucm = useAppSelector((s) => s.AppReducer.userColorScheme);
  const theme = useTheme();

  const [isLoadingHasLaunched, setIsLoadingHasLaunched] = React.useState(true);
  const [isLoadingAuthToken, setIsLoadingAuthToken] = React.useState(true);

  const LogInAuthTokenMutation = useMutation({
    mutationFn: (data: { authToken: string }) => loginAuthToken(data),
    // onSuccess: async (data) => {
    //   await signIn(data.result);
    // },
    // onError: (error: IError) => {
    //   console.log(JSON.stringify(error));
    // },
  });

  // React.useEffect(() => {
  //   const loadAsyncStorage = async () => {
  //     const hasLaunchedAS = await getStoreStringAsync(storeEnum.HasLaunched);
  //     if (hasLaunchedAS === "true") {
  //       hasLaunched.current = true;
  //     } else {
  //       // user has not launched the app yet
  //       await addStoreDataAsync(storeEnum.HasLaunched, "true");
  //     }

  //     setIsLoadingHasLaunched(false);
  //   };

  //   if (isFirst) {
  //     // Check if user has launched the app before
  //     loadAsyncStorage();
  //   } else {
  //     setIsLoadingHasLaunched(false);
  //   }
  // }, []);

  React.useEffect(() => {
    const loadSecureStore = async () => {
      const authTokenSS = await getSecureStoreDataAsync(storeEnum.AuthToken);
      if (authTokenSS.length > 0) {
        authToken.current = authTokenSS;

        try {
          const data = await LogInAuthTokenMutation.mutateAsync({
            authToken: authTokenSS,
          });

          await signIn(data.result);

          // Reset AuthToken
          authToken.current = '';
        } catch (e) {
          console.log('AuthToken Error: ', JSON.stringify(e));
          // If there is an error, remove the AuthToken
          if (isIError(e) && (e.status === 404 || e.status === 401 || e.status === 403))
            await removeSecureStoreDataAsync(storeEnum.AuthToken);
        }
      } else {
        // If it is an empty string, then the user has not signed in yet
        await removeSecureStoreDataAsync(storeEnum.AuthToken);
        setIsLoadingAuthToken(false);
      }
    };

    if (!isSignedIn && isFirst) {
      loadSecureStore();
    } else {
      setIsLoadingAuthToken(false);
    }
  }, [isSignedIn]);

  // console.log("isConnected", isConnected);

  if (isLoadingAuthToken) return <View style={{ flex: 1 }} />;

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GluestackUIProvider config={config} colorMode={ucm === 'dark' ? 'dark' : 'light'}>
        <BottomSheetModalProvider>
          <NavigationContainer
            theme={{
              dark: ucm === 'dark',
              colors: {
                ...DefaultTheme.colors,
                primary: theme.primary,
                background: theme.background,
                text: theme.text,
                card: theme.card,
              },
            }}>
            <Stack.Navigator
              initialRouteName={
                isSignedIn || authToken.current.length > 0
                  ? 'Main'
                  : hasLaunched.current
                    ? 'Auth'
                    : 'Onboarding'
              }
              screenOptions={{ ...screenOptions }}>
              {isSignedIn || authToken.current.length > 0 ? (
                <>
                  <Stack.Screen
                    name={'Main'}
                    component={BottomNavigation}
                    options={{
                      gestureEnabled: false,
                    }}
                  />

                  <Stack.Screen
                    name="UserProfileStack"
                    component={UserProfileNavigation}
                    options={{
                      headerShown: false,
                    }}
                  />

                  <Stack.Screen
                    name="ProfileSettingsStack"
                    component={ProfileSettingsNavigation}
                    options={{
                      headerShown: false,
                    }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name={'Onboarding'} component={OnboardingNavigation} />
                  <Stack.Screen name={'Auth'} component={AuthNavigation} />
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

const Test = () => {
  return (
    <View
      style={{
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
      }}>
      <Text>Test</Text>
    </View>
  );
};
