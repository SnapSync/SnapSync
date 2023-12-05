import { GetSessionId } from "@/api/routes/auth.routes";
import i18n from "@/lang";
import { RootState } from "@/redux/app/store";
import {
  updatePhoneNumberCountry,
  updateSessionId,
} from "@/redux/features/authentication/authenticationSlice";
import CountryListScreen from "@/screens/auth/country_list/country_list.screen";
import DateOfBirthScreen from "@/screens/auth/date_of_birth/date_of_birth.screen";
import FullNameScreen from "@/screens/auth/fullname/fullname.screen";
import OtpScreen from "@/screens/auth/otp/otp.screen";
import PhoneNumberScreen from "@/screens/auth/phone_number/phone_number.screen";
import UsernameScreen from "@/screens/auth/username/username.screen";
import { AuthStackParamList } from "@/types";
import { useColorMode } from "@gluestack-style/react";
import { CloseIcon, Icon, Text } from "@gluestack-ui/themed";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as CountyCodesList from "country-codes-list";
import * as Localization from "expo-localization";
import authKeys from "@/screens/auth/queries";
import { useNavigation } from "@react-navigation/native";

// Utilizzo un NativeStackNavigator per avere la possibilità di utilizzare: https://reactnavigation.org/docs/native-stack-navigator/#headersearchbaroptions
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const colorMode = useColorMode();
  const navigation = useNavigation();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: authKeys.session,
    queryFn: () => GetSessionId(),
    enabled: !authDto.sessionId && !isLoggedIn,
  });

  React.useEffect(() => {
    // Setto il session id per le successive chiamate
    if (data) dispatch(updateSessionId(data.sessionId));
  }, [data, dispatch]);

  React.useEffect(() => {
    if (!authDto.phoneNumberCountry) {
      let locales = Localization.getLocales();

      if (locales.length > 0 && locales[0].languageCode) {
        // Provo a recupero il prefisso del paese in base alla lingua del dispositivo
        const country = CountyCodesList.all().find(
          (c) => c.countryCode === locales[0].languageCode.toUpperCase()
        );

        if (country) dispatch(updatePhoneNumberCountry(country));
      }
    }
  }, [authDto, Localization, dispatch]);

  const goBack = () => navigation.goBack();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBackVisible: false,
        headerLeft: () => null,
        headerTitleAlign: "center",
        headerTitle: () => (
          <Text fontFamily="Lora-BoldItalic" fontSize="$lg">
            SnapSync
          </Text>
        ),
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="FullName" component={FullNameScreen} />
      <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen
        name="CountryList"
        component={CountryListScreen}
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={goBack}>
              <Icon
                as={CloseIcon}
                size="xl"
                color={colorMode === "dark" ? "$textDark0" : "#textLight950"}
              />
            </TouchableOpacity>
          ),
          animation: "slide_from_bottom",
          headerBlurEffect: colorMode === "dark" ? "dark" : "light",
          headerLargeTitle: true,
          headerTitle: i18n.t("auth.countryList.title"),
          headerLargeTitleStyle: {
            fontFamily: "Inter-SemiBold",
          },
          headerTitleStyle: {
            fontFamily: "Inter-SemiBold",
          },
        }}
      />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Username" component={UsernameScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
