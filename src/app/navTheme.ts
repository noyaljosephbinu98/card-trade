import { DarkTheme, DefaultTheme, type Theme as NavTheme } from '@react-navigation/native';

import type { Theme } from '@/features/theme';

export function buildNavTheme(theme: Theme): NavTheme {
  const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: theme.mode === 'dark',
    colors: {
      ...base.colors,
      background: theme.colors.bg,
      card: theme.colors.bg,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
      notification: theme.colors.danger,
    },
  };
}
