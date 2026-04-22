import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HomeScreen } from '@/features/listings/screens/HomeScreen';
import { ListingDetailScreen } from '@/features/listings/screens/ListingDetailScreen';
import { fontFamilies, useTheme } from '@/features/theme';

import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
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
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Marketplace' }} />
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: 'Listing', headerTitle: '' }}
      />
    </Stack.Navigator>
  );
}
