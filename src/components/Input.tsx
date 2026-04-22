import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/features/theme';

type Props = TextInputProps & {
  label?: string;
  labelRight?: React.ReactNode;
  helperText?: string;
  error?: string | undefined;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({
  label,
  labelRight,
  helperText,
  error,
  leftAdornment,
  rightAdornment,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { marginBottom: theme.spacing.lg },
        labelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm,
        },
        label: {
          ...theme.typography.overline,
          color: theme.colors.muted,
        },
        field: {
          minHeight: 52,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          flexDirection: 'row',
          alignItems: 'center',
        },
        fieldFocused: { borderColor: theme.colors.primary },
        fieldError: { borderColor: theme.colors.danger },
        input: {
          flex: 1,
          color: theme.colors.text,
          ...theme.typography.body,
          paddingVertical: theme.spacing.md,
        },
        leftSlot: { marginRight: theme.spacing.md },
        rightSlot: { marginLeft: theme.spacing.md },
        error: {
          ...theme.typography.caption,
          color: theme.colors.danger,
          marginTop: theme.spacing.xs,
        },
        helper: {
          ...theme.typography.caption,
          color: theme.colors.textTertiary,
          marginTop: theme.spacing.xs,
        },
      }),
    [theme],
  );

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label || labelRight ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {labelRight}
        </View>
      ) : null}

      <View
        style={[
          styles.field,
          focused && !error ? styles.fieldFocused : null,
          error ? styles.fieldError : null,
        ]}>
        {leftAdornment ? <View style={styles.leftSlot}>{leftAdornment}</View> : null}
        <TextInput
          placeholderTextColor={theme.colors.textTertiary}
          selectionColor={theme.colors.primary}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
        {rightAdornment ? <View style={styles.rightSlot}>{rightAdornment}</View> : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}
