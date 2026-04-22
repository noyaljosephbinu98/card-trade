import { Platform, type TextStyle } from 'react-native';

// 8px spacing grid. 20 is the horizontal screen padding per the AltLite spec.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

// Fraunces is the target display face. Until the font file ships with the
// bundle we fall back to a high-quality platform serif so the editorial tone
// still lands on first run.
const displayFamily = Platform.select({
  ios: 'Fraunces-SemiBold',
  android: 'Fraunces-SemiBold',
  default: 'serif',
}) as string;

const displayFallback = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
}) as string;

// Inter is the UI face. RN's system font on iOS is already San Francisco and
// on Android is Roboto — both close-enough fallbacks until Inter ships.
const uiFamily = Platform.select({
  ios: 'Inter',
  android: 'Inter',
  default: 'System',
}) as string;

export const fontFamilies = {
  display: displayFamily,
  displayFallback,
  ui: uiFamily,
} as const;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const typography = {
  // Display (Fraunces) — prices, card titles, auth hero.
  display: {
    fontFamily: displayFallback,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
    letterSpacing: -0.4,
  } as TextStyle,
  displayLg: {
    fontFamily: displayFallback,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '600',
    letterSpacing: -0.6,
  } as TextStyle,
  price: {
    fontFamily: displayFallback,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.2,
    ...tabular,
  } as TextStyle,

  // UI (Inter)
  screenTitle: { fontSize: 28, lineHeight: 34, fontWeight: '600' } as TextStyle,
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '600' } as TextStyle,
  h2: { fontSize: 20, lineHeight: 26, fontWeight: '600' } as TextStyle,
  h3: { fontSize: 17, lineHeight: 22, fontWeight: '600' } as TextStyle,
  body: { fontSize: 14, lineHeight: 20, fontWeight: '500' } as TextStyle,
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '600' } as TextStyle,
  meta: { fontSize: 13, lineHeight: 16, fontWeight: '500' } as TextStyle,
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' } as TextStyle,
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  } as TextStyle,
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: 0.2 } as TextStyle,
  tabular,
} as const;

export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Typography = typeof typography;
export type FontFamilies = typeof fontFamilies;
