import {StyleSheet, ViewStyle} from 'react-native';

import {colors} from './colors';
import {elevation} from './elevation';
import {radii} from './radii';

/**
 * Canonical card chrome used across the app.
 * Always prefer these tokens so list tiles, forms, and menus share one surface.
 */
export const cardSurface = {
  background: colors.surface,
  border: colors.border,
  radius: radii.xl,
  borderWidth: 1,
} as const;

export const cardShell: ViewStyle = {
  backgroundColor: cardSurface.background,
  borderColor: cardSurface.border,
  borderWidth: cardSurface.borderWidth,
  borderRadius: cardSurface.radius,
  overflow: 'hidden',
};

export const cardShellElevated: ViewStyle = {
  ...cardShell,
  ...elevation[1],
  // Re-assert after elevation spread so Android never falls back to a tinted surface.
  backgroundColor: cardSurface.background,
};

export const surfaces = StyleSheet.create({
  card: cardShell,
  cardElevated: cardShellElevated,
});
