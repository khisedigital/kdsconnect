import {colors, type Colors} from './colors';
import {elevation, type Elevation} from './elevation';
import {icons, type IconName} from './icons';
import {radii, type Radii} from './radii';
import {spacing, type Spacing} from './spacing';
import {
  cardShell,
  cardShellElevated,
  cardSurface,
  surfaces,
} from './surfaces';
import {typography, type TextVariant, type Typography} from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  elevation,
  icons,
  surfaces,
  cardSurface,
} as const;

export type Theme = {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  radii: Radii;
  elevation: Elevation;
  icons: typeof icons;
};

export {
  colors,
  elevation,
  icons,
  radii,
  spacing,
  typography,
  surfaces,
  cardSurface,
  cardShell,
  cardShellElevated,
  type Colors,
  type Elevation,
  type IconName,
  type Radii,
  type Spacing,
  type TextVariant,
  type Typography,
};

export default theme;
