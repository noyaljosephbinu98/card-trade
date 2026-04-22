import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/features/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: PressableProps['accessibilityLabel'];
  rightAdornment?: React.ReactNode;
  leftAdornment?: React.ReactNode;
  fullWidth?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading,
  disabled,
  style,
  accessibilityLabel,
  rightAdornment,
  leftAdornment,
  fullWidth = true,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          minHeight: size === 'lg' ? 52 : 44,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        primary: { backgroundColor: theme.colors.primary },
        secondary: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        ghost: { backgroundColor: 'transparent' },
        danger: { backgroundColor: theme.colors.danger },
        disabled: { opacity: 0.5 },
        label: { ...theme.typography.button },
        labelOnPrimary: { color: theme.colors.onPrimary },
        labelOnSecondary: { color: theme.colors.text },
        labelOnGhost: { color: theme.colors.primary },
        labelOnDanger: { color: '#FFFFFF' },
        adornmentLeft: { marginRight: theme.spacing.sm },
        adornmentRight: { marginLeft: theme.spacing.sm },
      }),
    [theme, size, fullWidth],
  );

  const variantStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'danger'
        ? styles.danger
        : variant === 'ghost'
          ? styles.ghost
          : styles.secondary;

  const labelStyle =
    variant === 'primary'
      ? styles.labelOnPrimary
      : variant === 'danger'
        ? styles.labelOnDanger
        : variant === 'ghost'
          ? styles.labelOnGhost
          : styles.labelOnSecondary;

  const spinnerColor =
    variant === 'primary'
      ? theme.colors.onPrimary
      : variant === 'danger'
        ? '#FFFFFF'
        : variant === 'ghost'
          ? theme.colors.primary
          : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={[styles.base, variantStyle, isDisabled && styles.disabled, style]}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          {leftAdornment ? <View style={styles.adornmentLeft}>{leftAdornment}</View> : null}
          <Text style={[styles.label, labelStyle]}>{title}</Text>
          {rightAdornment ? <View style={styles.adornmentRight}>{rightAdornment}</View> : null}
        </>
      )}
    </Pressable>
  );
}
