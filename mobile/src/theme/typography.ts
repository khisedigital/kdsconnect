import {Platform, TextStyle} from 'react-native';

/** Expressive system stacks — SF Pro / Roboto with clear hierarchy. */
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

const displayFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: undefined,
});

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export const letterSpacing = {
  tight: -0.6,
  normal: 0,
  wide: 0.2,
  wider: 0.4,
  label: 0.6,
} as const;

export const typography = {
  fontFamily,
  displayFamily,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  variants: {
    display: {
      fontFamily: displayFamily,
      fontSize: fontSizes.display,
      fontWeight: fontWeights.bold,
      lineHeight: Math.round(fontSizes.display * lineHeights.tight),
      letterSpacing: letterSpacing.tight,
    } satisfies TextStyle,
    h1: {
      fontFamily: displayFamily,
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      lineHeight: Math.round(fontSizes.xxl * lineHeights.tight),
      letterSpacing: letterSpacing.tight,
    } satisfies TextStyle,
    h2: {
      fontFamily: displayFamily,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: Math.round(fontSizes.xl * lineHeights.snug),
      letterSpacing: -0.3,
    } satisfies TextStyle,
    h3: {
      fontFamily,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semibold,
      lineHeight: Math.round(fontSizes.lg * lineHeights.snug),
      letterSpacing: letterSpacing.normal,
    } satisfies TextStyle,
    body: {
      fontFamily,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.regular,
      lineHeight: Math.round(fontSizes.md * lineHeights.normal),
      letterSpacing: letterSpacing.normal,
    } satisfies TextStyle,
    bodySmall: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.regular,
      lineHeight: Math.round(fontSizes.sm * lineHeights.normal),
      letterSpacing: letterSpacing.normal,
    } satisfies TextStyle,
    caption: {
      fontFamily,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: Math.round(fontSizes.xs * lineHeights.normal),
      letterSpacing: 0.1,
    } satisfies TextStyle,
    label: {
      fontFamily,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: Math.round(fontSizes.sm * lineHeights.snug),
      letterSpacing: letterSpacing.label,
      textTransform: 'none',
    } satisfies TextStyle,
    button: {
      fontFamily,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: Math.round(fontSizes.md * lineHeights.snug),
      letterSpacing: 0.15,
    } satisfies TextStyle,
  },
} as const;

export type Typography = typeof typography;
export type TextVariant = keyof typeof typography.variants;
