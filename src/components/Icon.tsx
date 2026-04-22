import React from 'react';
import type { TextStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '@/features/theme';

/**
 * Curated subset of Ionicons glyphs used across the app. Keeping a
 * type-safe whitelist means the IDE autocompletes valid names and the
 * wrapper stays a small, known surface (no `string` escape hatch).
 */
export type IconName =
  | 'home'
  | 'home-outline'
  | 'person'
  | 'person-outline'
  | 'heart'
  | 'heart-outline'
  | 'sunny-outline'
  | 'moon-outline'
  | 'search-outline'
  | 'options-outline'
  | 'close'
  | 'chevron-forward'
  | 'chevron-back'
  | 'time-outline'
  | 'ribbon-outline';

type Props = {
  name: IconName;
  size?: number;
  /** Hex/rgba color. When omitted, falls back to the theme text color. */
  color?: string;
  style?: TextStyle;
  accessibilityLabel?: string;
};

export const Icon = React.memo(function Icon({
  name,
  size = 20,
  color,
  style,
  accessibilityLabel,
}: Props) {
  const theme = useTheme();
  return (
    <Ionicons
      name={name}
      size={size}
      color={color ?? theme.colors.text}
      style={style}
      accessibilityLabel={accessibilityLabel}
      allowFontScaling={false}
    />
  );
});
