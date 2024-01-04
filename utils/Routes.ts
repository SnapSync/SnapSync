import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/* ------------------------------------------------------ Root ------------------------------------------------------ */
export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList> | undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainStackParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/* ------------------------------------------------------ Onboarding ------------------------------------------------------ */
export type OnboardingStackParamList = {
  Welcome: undefined;
};

export type OnboardingStackScreenProps<
  Screen extends keyof OnboardingStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<OnboardingStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
export type AuthStackParamList = {
  LogIn: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ Main ------------------------------------------------------ */
export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
};

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
