import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { darkPalette, lightPalette, type Palette } from './palettes';
import { type ResolvedMode, useThemeStore } from './store';
import { radius, spacing, typography } from './tokens';

export type Theme = {
  mode: ResolvedMode;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};

export type SystemScheme = 'light' | 'dark' | 'unspecified' | null | undefined;

export function resolveMode(mode: 'system' | 'light' | 'dark', system: SystemScheme): ResolvedMode {
  if (mode === 'system') return system === 'dark' ? 'dark' : 'light';
  return mode;
}

export function useTheme(): Theme {
  const mode = useThemeStore(s => s.mode);
  const system = useColorScheme();
  const resolved = resolveMode(mode, system);

  return useMemo<Theme>(
    () => ({
      mode: resolved,
      colors: resolved === 'dark' ? darkPalette : lightPalette,
      spacing,
      radius,
      typography,
    }),
    [resolved],
  );
}

export function useResolvedMode(): ResolvedMode {
  const mode = useThemeStore(s => s.mode);
  const system = useColorScheme();
  return resolveMode(mode, system);
}
