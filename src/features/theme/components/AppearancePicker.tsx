import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type ThemeMode, useThemeStore } from '../store';
import { useTheme } from '../useTheme';

const OPTIONS: readonly { id: ThemeMode; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export const AppearancePicker = React.memo(function AppearancePicker() {
  const theme = useTheme();
  const mode = useThemeStore(s => s.mode);
  const setMode = useThemeStore(s => s.setMode);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        label: {
          ...theme.typography.overline,
          color: theme.colors.muted,
          marginBottom: theme.spacing.sm,
        },
        row: {
          flexDirection: 'row',
          gap: theme.spacing.sm,
        },
        chip: {
          flex: 1,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        chipActive: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        chipText: {
          ...theme.typography.bodyMedium,
          color: theme.colors.text,
        },
        chipTextActive: {
          color: theme.colors.onPrimary,
        },
      }),
    [theme],
  );

  return (
    <View>
      <Text style={styles.label}>Appearance</Text>
      <View style={styles.row}>
        {OPTIONS.map(opt => {
          const active = mode === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setMode(opt.id)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Set theme to ${opt.label}`}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
