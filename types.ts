import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/* ------------------------------------------------------ Root ------------------------------------------------------ */
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainStack: NavigatorScreenParams<MainStackParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
export type AuthStackParamList = {
  FullName: undefined;
  DateOfBirth: undefined;
  PhoneNumber: undefined;
  Otp: undefined;
  Username: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ Main ------------------------------------------------------ */
export type MainStackParamList = {
  Home: undefined;
  MyUserProfile: NavigatorScreenParams<UserProfileStackParamList> | undefined;
};

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ UserProfile ------------------------------------------------------ */
export type UserProfileStackParamList = {
  UserProfile:
    | {
        id: number;
        username?: string;
        fullName?: string;
        isVerified?: boolean;
        profilePictureUrl?: string;
      }
    | undefined; // Se non è presente carico il profilo dell'utente loggato

  MutualFriends: {
    id: number;
  };
};

export type UserProfileStackScreenProps<
  Screen extends keyof UserProfileStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<UserProfileStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
