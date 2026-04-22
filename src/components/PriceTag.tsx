import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/features/theme';
import { formatCurrency } from '@/utils/formatters';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  amount: number;
  priorAmount?: number;
  size?: Size;
  align?: 'left' | 'right';
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  priceStyle?: StyleProp<TextStyle>;
};

export function PriceTag({
  amount,
  priorAmount,
  size = 'md',
  align = 'left',
  subtitle,
  style,
  priceStyle,
}: Props) {
  const theme = useTheme();

  const styles = useMemo(() => {
    const priceBase =
      size === 'lg'
        ? { ...theme.typography.display, fontSize: 28, lineHeight: 32 }
        : size === 'sm'
        ? { ...theme.typography.price, fontSize: 16, lineHeight: 20 }
        : theme.typography.price;

    return StyleSheet.create({
      wrap: {
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: theme.spacing.sm,
      },
      price: {
        ...priceBase,
        color: theme.colors.primary,
        fontVariant: ['tabular-nums'],
      } as TextStyle,
      prior: {
        ...theme.typography.caption,
        color: theme.colors.textTertiary,
        textDecorationLine: 'line-through',
        fontVariant: ['tabular-nums'],
      } as TextStyle,
      subtitle: {
        ...theme.typography.caption,
        color: theme.colors.muted,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
      },
    });
  }, [theme, align, size]);

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        <Text style={[styles.price, priceStyle]}>{formatCurrency(amount)}</Text>
        {priorAmount != null && priorAmount !== amount ? (
          <Text style={styles.prior}>{formatCurrency(priorAmount)}</Text>
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
