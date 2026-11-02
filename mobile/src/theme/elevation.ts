import {Platform, ViewStyle} from 'react-native';

type ElevationLevel = 0 | 1 | 2 | 3;

const iosShadow = (
  offsetY: number,
  radius: number,
  opacity: number,
): ViewStyle => ({
  shadowColor: '#14212B',
  shadowOffset: {width: 0, height: offsetY},
  shadowOpacity: opacity,
  shadowRadius: radius,
});

const androidElevation = (elevation: number): ViewStyle => ({
  elevation,
});

export const elevation: Record<ElevationLevel, ViewStyle> = {
  0: Platform.select({
    ios: iosShadow(0, 0, 0),
    android: androidElevation(0),
    default: {},
  }) as ViewStyle,
  1: Platform.select({
    ios: iosShadow(1, 3, 0.08),
    android: androidElevation(2),
    default: {},
  }) as ViewStyle,
  2: Platform.select({
    ios: iosShadow(2, 8, 0.12),
    android: androidElevation(4),
    default: {},
  }) as ViewStyle,
  3: Platform.select({
    ios: iosShadow(4, 16, 0.16),
    android: androidElevation(8),
    default: {},
  }) as ViewStyle,
};

export type Elevation = typeof elevation;
