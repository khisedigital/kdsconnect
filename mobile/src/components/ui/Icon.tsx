import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {colors} from '../../theme/colors';
import {IconName, icons} from '../../theme/icons';
import {fontSizes} from '../../theme/typography';

export type IconColor = 'primary' | 'secondary' | 'inverse' | 'accent' | 'muted';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: IconColor;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const colorMap: Record<IconColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  inverse: colors.text.inverse,
  accent: colors.accent,
  muted: colors.text.disabled,
};

export function Icon({
  name,
  size = fontSizes.lg,
  color = 'primary',
  style,
  accessibilityLabel,
}: IconProps) {
  const entry = icons[name];

  return (
    <FontAwesome5
      name={entry.fa}
      solid
      size={size}
      color={colorMap[color]}
      style={style}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? entry.label}
    />
  );
}
