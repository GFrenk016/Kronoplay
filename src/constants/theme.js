// Design tokens centralizzati: colori, spaziature, tipografia e raggi.
// Tenerli qui rende banale un futuro restyle o l'introduzione di temi multipli.

export const colors = {
  background: '#0F1115',
  surface: '#1A1D24',
  surfaceAlt: '#232733',
  border: '#2C313D',
  primary: '#6C5CE7',
  primaryMuted: '#4B3FB0',
  text: '#F5F6FA',
  textMuted: '#9AA0AE',
  textFaint: '#5E6472',
  star: '#FFC542',
  danger: '#E74C6C',
  success: '#2ECC71',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' },
  h2: { fontSize: 20, fontWeight: '700' },
  title: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
};
