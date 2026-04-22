export type Palette = {
  // Core surfaces
  bg: string;
  card: string;
  cardElevated: string;

  // Text
  text: string;
  muted: string;
  textTertiary: string;

  // Structure
  border: string;

  // Brand accent (antique gold — CTAs, prices)
  primary: string;
  primaryMuted: string;
  onPrimary: string;

  // Status
  danger: string;
  success: string;
  warning: string;

  // Misc
  overlay: string;
};

export const lightPalette: Palette = {
  bg: '#F7F8FA',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  text: '#0B0D10',
  muted: '#4B5563',
  textTertiary: '#6B7280',

  border: '#E5E7EB',

  primary: '#D4A24C',
  primaryMuted: '#F3E6C9',
  onPrimary: '#0B0D10',

  danger: '#E5484D',
  success: '#3CCB7F',
  warning: '#F5A524',

  overlay: 'rgba(11, 13, 16, 0.45)',
};

export const darkPalette: Palette = {
  bg: '#0B0D10',
  card: '#14171C',
  cardElevated: '#1B1F26',

  text: '#F2F4F7',
  muted: '#A7B0BD',
  textTertiary: '#6B7280',

  border: '#242A33',

  primary: '#D4A24C',
  primaryMuted: '#3A2F18',
  onPrimary: '#0B0D10',

  danger: '#E5484D',
  success: '#3CCB7F',
  warning: '#F5A524',

  overlay: 'rgba(0, 0, 0, 0.65)',
};
