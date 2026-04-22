import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const URL_SCHEME = 'myalt';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [`${URL_SCHEME}://`, 'https://alt-lite.app'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'search',
              ListingDetail: 'listing/:id',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Saved: 'saved',
              EditProfile: 'profile/edit',
            },
          },
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
    },
  },
};
