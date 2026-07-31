export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  surface: string;
  card: string;
  hero: string;
  heroText: string;
  primary: string;
  primaryText: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  success: string;
  danger: string;
  warning: string;
  accentGreen: string;
  accentGreenDark: string;
  accentYellow: string;
  accentPink: string;
  accentTeal: string;
  chipBackground: string;
  chipBackgroundActive: string;
  chipText: string;
  chipTextActive: string;
  shadow: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  mode: 'light',
  background: '#FBF6EE',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  hero: '#1F3B2C',
  heroText: '#FBF6EE',
  primary: '#2C4A3B',
  primaryText: '#FFFFFF',
  text: '#1C1C1C',
  textPrimary: '#1C1C1C',
  textSecondary: '#5A5A52',
  textMuted: '#9A9587',
  border: '#ECE4D6',
  divider: '#F0E9DC',
  success: '#3E7A55',
  danger: '#C1553B',
  warning: '#D9A441',
  accentGreen: '#3E7A55',
  accentGreenDark: '#1F3B2C',
  accentYellow: '#D9A441',
  accentPink: '#E17A5D',
  accentTeal: '#3E8C86',
  chipBackground: '#F1EADC',
  chipBackgroundActive: '#1F3B2C',
  chipText: '#5A5A52',
  chipTextActive: '#FBF6EE',
  shadow: 'rgba(31, 59, 44, 0.08)',
  overlay: 'rgba(20, 20, 16, 0.45)',
};

export const darkColors: ThemeColors = {
  mode: 'dark',
  background: '#12140F',
  surface: '#1E2319',
  card: '#1E2319',
  hero: '#0E1A12',
  heroText: '#F5EFE2',
  primary: '#7FB597',
  primaryText: '#0E1A12',
  text: '#F2EEE3',
  textPrimary: '#F2EEE3',
  textSecondary: '#B9B3A2',
  textMuted: '#7C7869',
  border: '#2A2E22',
  divider: '#252A1E',
  success: '#6FAE84',
  danger: '#E17A5D',
  warning: '#E4B75E',
  accentGreen: '#6FAE84',
  accentGreenDark: '#3E7A55',
  accentYellow: '#E4B75E',
  accentPink: '#E17A5D',
  accentTeal: '#5CACA4',
  chipBackground: '#242A1D',
  chipBackgroundActive: '#7FB597',
  chipText: '#B9B3A2',
  chipTextActive: '#0E1A12',
  shadow: 'rgba(0, 0, 0, 0.35)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 12,
  md: 20,
  lg: 24,
  full: 999,
  pill: 999,
};

// Kept for any file still importing `radius` instead of `radii`.
export const radius = radii;

export const typography = {
  hero: { fontSize: 32, fontWeight: '700' as const },
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
};

export const gradients = {
  todo: ['#E4B75E', '#B9822C'] as const,
  progress: ['#5CACA4', '#2C645F'] as const,
  done: ['#6FAE84', '#2F5C42'] as const,
  bookmarked: ['#8C7FC4', '#4A4470'] as const, 
  overdue: ['#E17A5D', '#8C4A3D'] as const, 
  cta: ['#7FB597', '#2C4A3B'] as const,
  hero: ['#274E38', '#0E1A12'] as const,
};

export const cardPalette = [
  { bg: '#2F5C42', text: '#F3F7F1' }, 
  { bg: '#B9822C', text: '#FFF8EA' },
  { bg: '#2C645F', text: '#EFFBF9' }, 
  { bg: '#8C4A3D', text: '#FBEFEA' }, 
  { bg: '#4A4470', text: '#F1EFFA' }, 
];

export function getCardColors(index: number) {
  return cardPalette[index % cardPalette.length];
}

export function getColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? darkColors : lightColors;
}