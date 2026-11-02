/**
 * KDS Connect visual identity — deep ocean teal for trust,
 * warm copper accent for commerce CTAs, cool mist surfaces.
 */
export const colors = {
  primary: '#0A3342',
  primaryMuted: '#145566',
  primarySoft: '#E6F1F4',
  accent: '#C45C1A',
  accentSoft: '#F8EADF',
  accentBright: '#E07A3A',

  ink: '#0B1720',
  mist: '#E8EEF2',
  haze: '#F2F6F8',

  background: '#EEF3F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F7FAFB',

  text: {
    primary: '#0B1720',
    secondary: '#4E6170',
    tertiary: '#7A8B97',
    inverse: '#FFFFFF',
    disabled: '#9AA8B3',
  },

  border: '#D5E0E7',
  borderStrong: '#B7C7D1',
  borderFocus: '#0A3342',

  semantic: {
    success: '#0C7A4B',
    warning: '#A85A0A',
    error: '#B42318',
    info: '#1769A3',
  },

  overlay: 'rgba(11, 23, 32, 0.52)',

  brand: {
    deep: '#062631',
    mid: '#0A3342',
    light: '#1A6B7C',
    wash: '#D7EBEF',
    glow: 'rgba(26, 107, 124, 0.22)',
  },

  statusBadge: {
    success: {
      background: '#E3F5EC',
      text: '#0C7A4B',
      border: '#B5DFC8',
    },
    warning: {
      background: '#FBF0E0',
      text: '#A85A0A',
      border: '#EFD2A8',
    },
    error: {
      background: '#FCEBEA',
      text: '#B42318',
      border: '#F0C0BC',
    },
    info: {
      background: '#E7F2FA',
      text: '#1769A3',
      border: '#B5D4EB',
    },
    neutral: {
      background: '#EEF2F5',
      text: '#4E6170',
      border: '#D5E0E7',
    },
  },
} as const;

export type Colors = typeof colors;
