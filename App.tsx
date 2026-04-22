import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { Linking, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { linking, URL_SCHEME } from '@/app/linking';
import { buildNavTheme } from '@/app/navTheme';
import { usePendingLinkStore } from '@/app/pendingLink';
import { RootNavigator } from '@/app/RootNavigator';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/features/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppShell() {
  const theme = useTheme();
  const navTheme = useMemo(() => buildNavTheme(theme), [theme]);
  const isAuthed = useAuthStore((s) => s.currentUserId != null);
  const setPending = usePendingLinkStore((s) => s.setPending);
  const consumePending = usePendingLinkStore((s) => s.consume);

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      if (!url.startsWith(`${URL_SCHEME}://`)) return;
      if (!useAuthStore.getState().currentUserId) {
        setPending(url);
      }
    });
    (async () => {
      const initial = await Linking.getInitialURL();
      if (initial && initial.startsWith(`${URL_SCHEME}://`) && !useAuthStore.getState().currentUserId) {
        setPending(initial);
      }
    })();
    return () => sub.remove();
  }, [setPending]);

  useEffect(() => {
    if (isAuthed) {
      const pending = consumePending();
      if (pending) {
        Linking.openURL(pending).catch(() => undefined);
      }
    }
  }, [isAuthed, consumePending]);

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bg}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppShell />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
