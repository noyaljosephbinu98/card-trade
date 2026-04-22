import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HomeStackParamList, MainTabParamList, ProfileStackParamList } from '@/app/types';
import { Icon } from '@/components';
import { useTheme } from '@/features/theme';

import { useSavedCount } from '../store';

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<ProfileStackParamList>
  >
>;

/**
 * Header-right shortcut to the Saved list. Renders nothing when there's
 * nothing to jump to, so the chrome stays quiet on first run.
 */
export const SavedHeaderButton = React.memo(function SavedHeaderButton() {
  const theme = useTheme();
  const savedCount = useSavedCount();
  const navigation = useNavigation<Nav>();

  const onPress = useCallback(() => {
    navigation.navigate('ProfileTab', { screen: 'Saved' });
  }, [navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          width: 40,
          height: 40,
          borderRadius: theme.radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginRight: theme.spacing.md,
        },
        badge: {
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 18,
          height: 18,
          paddingHorizontal: 5,
          borderRadius: 9,
          backgroundColor: theme.colors.primary,
          borderWidth: 2,
          borderColor: theme.colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        badgeText: {
          fontSize: 10,
          lineHeight: 12,
          fontWeight: '700',
          color: theme.colors.onPrimary,
          fontVariant: ['tabular-nums'],
        },
      }),
    [theme],
  );

  if (savedCount <= 0) return null;

  const shown = savedCount > 99 ? '99+' : String(savedCount);

  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Saved listings, ${savedCount} ${savedCount === 1 ? 'item' : 'items'}`}>
      <Icon name="heart" size={18} color={theme.colors.danger} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{shown}</Text>
      </View>
    </Pressable>
  );
});
