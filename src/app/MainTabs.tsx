import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components';
import { useTheme } from '@/features/theme';

import { HomeStack } from './HomeStack';
import { ProfileStack } from './ProfileStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({
  filled,
  outlined,
  focused,
  color,
}: {
  filled: IconName;
  outlined: IconName;
  focused: boolean;
  color: string;
}) {
  return <Icon name={focused ? filled : outlined} size={22} color={color} />;
}

export function MainTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Tab bar needs to grow to include the bottom safe-area inset (Android gesture
  // nav bar, iOS home indicator); otherwise labels get clipped.
  const BASE_HEIGHT = 58;
  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.bg,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      height: BASE_HEIGHT + insets.bottom,
      paddingTop: 8,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
    }),
    [theme.colors.bg, theme.colors.border, insets.bottom],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
        tabBarStyle,
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon filled="home" outlined="home-outline" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon filled="person" outlined="person-outline" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
}
