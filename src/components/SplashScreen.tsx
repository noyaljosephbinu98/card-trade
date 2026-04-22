import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme, type Theme } from '@/features/theme';

type Props = {
  label?: string;
  /**
   * When true, only the spinner is shown without the wordmark. Use for
   * brief in-app transitions (e.g. post-login pending-link replay) where a
   * full splash would feel heavy.
   */
  compact?: boolean;
};

/**
 * Full-bleed loader used while global state is settling (auth rehydrate,
 * post-login link replay). Reads from the active theme so the status bar
 * and chrome stay coherent across light/dark.
 */
export const SplashScreen = React.memo(function SplashScreen({
  label,
  compact = false,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Loading'}>
      {compact ? null : <Text style={styles.wordmark}>AltLite</Text>}
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
});

function createStyles(theme: Theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg,
      gap: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
    },
    wordmark: {
      ...theme.typography.display,
      fontSize: 28,
      lineHeight: 32,
      color: theme.colors.primary,
      letterSpacing: -0.4,
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.muted,
      textAlign: 'center',
    },
  });
}
