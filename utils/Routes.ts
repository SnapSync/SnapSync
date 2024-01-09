import { IUserProfilePicture, IUserZodiacSign } from '@/modules/app/types/IUserDTO';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
  UserProfileStack: NavigatorScreenParams<UserProfileStackParamList> | undefined;
  ProfileSettingsStack: NavigatorScreenParams<ProfileSettingsStackParamList> | undefined;
  ReportUser: {
    id: number;
    username: string;
    profilePicture: IUserProfilePicture | null;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

/* ------------------------------------------------------ Onboarding ------------------------------------------------------ */
export type OnboardingStackParamList = {
  Welcome: undefined;
};

export type OnboardingStackScreenProps<Screen extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OnboardingStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
export type AuthStackParamList = {
  LogIn: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ Main ------------------------------------------------------ */
export type MainStackParamList = {
  Home: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type MainStackScreenProps<Screen extends keyof MainStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ Profile ------------------------------------------------------ */
export type ProfileStackParamList = {
  Profile: {
    username?: string;
  };
  FriendsList: {
    total?: number;
  };
};

export type ProfileStackScreenProps<Screen extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ ProfileSettings ------------------------------------------------------ */
export type ProfileSettingsStackParamList = {
  Settings: undefined;

  // EditProfile: undefined;
  // TakeProfilePicture: undefined;

  // Other: undefined;

  // BlockedUsers: undefined;
};

export type ProfileSettingsStackScreenProps<Screen extends keyof ProfileSettingsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileSettingsStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ UserProfile ------------------------------------------------------ */
export type FriendshipLoader = 'add' | 'incoming' | 'outgoing';

export type UserProfileStackParamList = {
  UserProfile: {
    // isMyProfile: boolean;
    id: number;

    profilePicture?: IUserProfilePicture | null;
    zodiacSign?: IUserZodiacSign;

    username?: string;
    fullname?: string;
    isVerified?: boolean;

    biography?: string | null;

    streak?: number;

    fsLoader?: FriendshipLoader;
  };

  MutualFriendsList: {
    id: number;
    total?: number;
  };
};

export type UserProfileStackScreenProps<Screen extends keyof UserProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<UserProfileStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
