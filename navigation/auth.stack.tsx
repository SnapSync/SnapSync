import { AuthDto } from "@/dtos/auth.dto";
import DateOfBirthScreen from "@/screens/auth/date_of_birth/date_of_birth.screen";
import FullNameScreen from "@/screens/auth/fullname/fullname.screen";
import OtpScreen from "@/screens/auth/otp/otp.screen";
import PhoneNumberScreen from "@/screens/auth/phone_number/phone_number.screen";
import { AuthStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="FullName" component={FullNameScreen} />
      <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
