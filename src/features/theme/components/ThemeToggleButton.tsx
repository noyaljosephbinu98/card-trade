import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components';

import { useThemeStore } from '../store';
import { useTheme } from '../useTheme';

export const ThemeToggleButton = React.memo(function ThemeToggleButton() {
  const theme = useTheme();

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
      }),
    [theme],
  );

  const onPress = useCallback(() => {
    const current = useThemeStore.getState();
    current.toggle(theme.mode);
  }, [theme.mode]);

  const isDark = theme.mode === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Icon name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color={theme.colors.text} />
    </Pressable>
  );
});
