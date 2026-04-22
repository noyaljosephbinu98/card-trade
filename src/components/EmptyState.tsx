import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/features/theme';

import { Button } from './Button';

type Props = {
  title: string;
  subtitle?: string;
  /** Single optional primary action (CTA) */
  actionLabel?: string;
  onAction?: () => void;
  /** Optional tone for subtle status hints; "danger" swaps the emblem border. */
  tone?: 'default' | 'danger';
};

export function EmptyState({ title, subtitle, actionLabel, onAction, tone = 'default' }: Props) {
  const theme = useTheme();

  const borderColor = tone === 'danger' ? theme.colors.danger : theme.colors.border;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.xxl,
          paddingVertical: theme.spacing.xxxl,
          gap: theme.spacing.md,
        },
        emblem: {
          width: 64,
          height: 64,
          borderRadius: theme.radius.pill,
          borderWidth: 1,
          borderColor,
          marginBottom: theme.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        },
        emblemDot: {
          width: 10,
          height: 10,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.primary,
          opacity: 0.75,
        },
        title: {
          ...theme.typography.display,
          fontSize: 22,
          lineHeight: 28,
          color: theme.colors.text,
          textAlign: 'center',
        },
        subtitle: {
          ...theme.typography.body,
          color: theme.colors.muted,
          textAlign: 'center',
          maxWidth: 300,
        },
        action: {
          marginTop: theme.spacing.lg,
          alignSelf: 'stretch',
          maxWidth: 280,
        },
      }),
    [theme, borderColor],
  );

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.emblem}>
        <View style={styles.emblemDot} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
