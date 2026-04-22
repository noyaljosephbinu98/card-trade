import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/features/theme';

import { Button } from './Button';
import { Icon } from './Icon';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
};

/**
 * Generic "Coming soon" overlay. Used wherever we surface a CTA (Buy now,
 * Place bid, Checkout, etc.) that the backend for this build doesn't support.
 * Shares the same Modal-based pattern as FilterSheet so we don't pull in a
 * bottom-sheet dep just for this.
 */
export const ComingSoonOverlay = React.memo(function ComingSoonOverlay({
  visible,
  onClose,
  title = 'Coming soon',
  subtitle = 'Checkout isn’t part of this build yet. Your listing stays safe in Saved.',
  actionLabel = 'Got it',
}: Props) {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: theme.colors.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.xl,
        },
        card: {
          width: '100%',
          maxWidth: 360,
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.xl,
          alignItems: 'center',
          gap: theme.spacing.md,
        },
        iconWrap: {
          width: 56,
          height: 56,
          borderRadius: theme.radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primaryMuted,
          marginBottom: theme.spacing.xs,
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
          maxWidth: 280,
        },
        action: {
          alignSelf: 'stretch',
          marginTop: theme.spacing.md,
        },
      }),
    [theme],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={() => undefined} style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="time-outline" size={28} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.action}>
            <Button title={actionLabel} onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});
