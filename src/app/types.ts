import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  Home: {
    q?: string;
    category?: string;
    kind?: 'FIXED_PRICE' | 'AUCTION' | 'any';
    minPrice?: string;
    maxPrice?: string;
    gradingCompany?: string;
    sort?: string;
  };
  ListingDetail: { id: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Saved: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
