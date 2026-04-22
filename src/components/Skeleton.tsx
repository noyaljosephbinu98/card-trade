import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/features/theme';

type Tone = 'surface' | 'elevated';

type Props = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = '100%',
  height = 16,
  radius,
  tone = 'surface',
  style,
}: Props) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          backgroundColor: tone === 'elevated' ? theme.colors.cardElevated : theme.colors.card,
          borderRadius: radius ?? theme.radius.sm,
        },
      }),
    [theme, radius, tone],
  );

  return <Animated.View style={[styles.base, { width, height, opacity }, style]} />;
}
