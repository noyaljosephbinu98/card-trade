import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { SplashScreen } from '@/components';
import { useAuthStore } from '@/features/auth';

import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthed = currentUserId != null;

  // Block the nav tree on the first run until AsyncStorage replays the
  // persisted auth state — otherwise a previously-signed-in user momentarily
  // sees the Login screen flash before we swap to MainTabs.
  if (!hasHydrated) {
    return <SplashScreen label="Getting things ready" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthed ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
