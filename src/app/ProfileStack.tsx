import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { EditProfileScreen } from '@/features/profile/screens/EditProfileScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { SavedScreen } from '@/features/saved/screens/SavedScreen';
import { fontFamilies, useTheme } from '@/features/theme';

import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bg },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: fontFamilies.displayFallback,
          fontSize: 18,
          fontWeight: '600',
        },
        contentStyle: { backgroundColor: theme.colors.bg },
        headerBackTitle: '',
      }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen name="Saved" component={SavedScreen} options={{ title: 'Saved' }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit profile' }}
      />
    </Stack.Navigator>
  );
}
