import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import AuthStack from "./auth.stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import MainStack from "./main.stack";
import { setAuthToken } from "@/redux/features/auth/authSlice";
import { useNetInfo } from "@react-native-community/netinfo";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  authToken?: string;
};

const RootNavigation = ({ authToken }: Props) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const authTokenRedux = useSelector(
    (state: RootState) => state.auth.authToken
  );

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (authToken) {
      // Lo salvo nello store di redux
      dispatch(setAuthToken(authToken));
    } else {
      setIsLoading(false);
    }
  }, [authToken]);

  React.useEffect(() => {
    if (authTokenRedux) {
      // Ho finito di caricare
      setIsLoading(false);
    }
  }, [authTokenRedux]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoggedIn || authTokenRedux ? (
        <Stack.Group>
          <Stack.Screen
            name="MainStack"
            component={MainStack}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
