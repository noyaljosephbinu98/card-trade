import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/features/theme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export const Chip = React.memo(function Chip({
  label,
  active,
  onPress,
  accessibilityLabel,
}: Props) {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs + 2,
          borderRadius: theme.radius.sm, // 8px per AltLite spec
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
        },
        active: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        label: {
          ...theme.typography.caption,
          fontWeight: '600',
          color: theme.colors.text,
          letterSpacing: 0.3,
        },
        labelActive: { color: theme.colors.onPrimary },
      }),
    [theme],
  );

  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, active && styles.active]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: !!active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
});
