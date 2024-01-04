import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/utils/Routes";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/modules/app/api";
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { IError } from "@/utils/network/Abstract";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LogIn" component={LogInScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;

const LogInScreen = () => {
  const [userId, setUserId] = React.useState<number>();

  const LogInMutation = useMutation({
    mutationFn: (data: { userId: number }) => login(data),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: IError) => {
      console.log(JSON.stringify(error.message));
    },
  });

  // const goHomePage = React.useCallback(() => {
  //   dispatcher(SetUser({ name: "Matteo Urso" }));
  // }, []);

  const _onPress = () => {
    if (!userId) return;
    LogInMutation.mutate({ userId: userId });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Input>
        <InputField
          value={userId?.toString()}
          onChangeText={(text) => {
            if (text.length > 0) setUserId(parseInt(text));
            else setUserId(undefined);
          }}
          keyboardType="numeric"
        />
      </Input>
      <Button onPress={_onPress}>
        {LogInMutation.isPending ? (
          <ButtonSpinner />
        ) : (
          <ButtonText>Log In</ButtonText>
        )}
      </Button>
    </View>
  );
};
