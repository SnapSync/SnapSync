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
  UserProfileStack:
    | NavigatorScreenParams<UserProfileStackParamList>
    | undefined;

  UserSettingsStack:
    | NavigatorScreenParams<UserSettingsStackParamList>
    | undefined;

  Details: {
    id: number;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
export type AuthStackParamList = {
  FullName: undefined;
  DateOfBirth: undefined;
  PhoneNumber: undefined;
  CountryList: undefined;
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
  // MyUserProfile: NavigatorScreenParams<UserProfileStackParamList> | undefined;
  Discovery: NavigatorScreenParams<DiscoveryStackParamList> | undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ Profile ------------------------------------------------------ */
export type ProfileStackParamList = {
  Profile: {
    username?: string;
  };
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ UserProfile ------------------------------------------------------ */
export type UserProfileStackParamList = {
  UserProfile: {
    // isMyProfile: boolean;
    id: number;

    profilePictureUrl?: string | null;
    profilePictureBlurHash?: string | null;

    username?: string;
    fullname?: string;
    isVerified?: boolean;

    biography?: string | null;

    streak?: number;

    mutualFriends?: number;
    friends?: number;

    // Mi servirà per eseguire un loader all'inizio, quando non ho niente salvato in locale
    friendshipLoader?: "incoming" | "outgoing" | "add";
  };

  MutualFriends: {
    id: number;
    total?: number;
  };
};

export type UserProfileStackScreenProps<
  Screen extends keyof UserProfileStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<UserProfileStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ Discovery ------------------------------------------------------ */
export type DiscoveryStackParamList = {
  Search: undefined;
  OutgoingFriendRequests: undefined;
};

export type DiscoveryStackScreenProps<
  Screen extends keyof DiscoveryStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<DiscoveryStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ UserSettings ------------------------------------------------------ */
export type UserSettingsStackParamList = {
  Settings: undefined;
};

export type UserSettingsStackScreenProps<
  Screen extends keyof UserSettingsStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<UserSettingsStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
